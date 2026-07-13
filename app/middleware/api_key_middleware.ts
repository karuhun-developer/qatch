import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import User from '#models/user'
import encryption from '@adonisjs/core/services/encryption'

export default class ApiKeyMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const { request, response } = ctx

    const apiKey = request.header('x-api-key')
    if (!apiKey) {
      return response.unauthorized({ message: 'Missing x-api-key header' })
    }

    // Validasi dengan cara encryption.decrypt lalu compare ke API key di header
    // Karena kita tidak bisa query langsung ke kolom apiKey yang dienkripsi (salt berbeda tiap encrypt),
    // kita load users yang punya apiKey dan cocokan manual
    const users = await User.query().whereNotNull('apiKey')
    let authenticatedUser: User | null = null

    for (const user of users) {
      try {
        const decryptedKey = encryption.decrypt(user.apiKey!) as string
        if (decryptedKey === apiKey) {
          authenticatedUser = user
          break
        }
      } catch (e) {
        // Abaikan jika gagal decrypt
      }
    }

    if (!authenticatedUser) {
      return response.unauthorized({ message: 'Invalid API Key' })
    }

    // Inject user ke object auth agar controller bisa memanggil auth.user
    if (ctx.auth) {
      const guard = ctx.auth.use('web')
      guard.user = authenticatedUser
      guard.isAuthenticated = true
    }

    return next()
  }
}

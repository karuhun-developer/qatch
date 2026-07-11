import type { HttpContext } from '@adonisjs/core/http'
import encryption from '@adonisjs/core/services/encryption'
import string from '@adonisjs/core/helpers/string'
import vine from '@vinejs/vine'

export default class ProfileController {
  async index({ inertia, auth }: HttpContext) {
    const user = auth.user!
    
    // Decrypt API Key if it exists
    let decryptedApiKey: string | null = null
    if (user.apiKey) {
      decryptedApiKey = encryption.decrypt(user.apiKey) as string
    }

    return inertia.render('profile', {
      apiKey: decryptedApiKey,
      hasHmac: !!user.hmacKey // Only send boolean if it exists
    })
  }

  async updateHmac({ request, response, auth, session }: HttpContext) {
    const payload = await request.validateUsing(
      vine.compile(
        vine.object({
          hmacString: vine.string().trim().minLength(8)
        })
      )
    )

    const user = auth.user!
    
    user.hmacKey = payload.hmacString
    await user.save()

    session.flash('success', 'HMAC Key berhasil disimpan.')
    return response.redirect().back()
  }

  async generateApiKey({ response, auth, session }: HttpContext) {
    const user = auth.user!
    
    // Generate a random 32-character string
    const rawApiKey = `sk_test_${string.random(32)}`
    
    // Encrypt it using AdonisJS encryption module
    const encryptedApiKey = encryption.encrypt(rawApiKey)
    
    user.apiKey = encryptedApiKey
    await user.save()

    session.flash('success', 'API Key baru berhasil di-generate.')
    return response.redirect().back()
  }
}
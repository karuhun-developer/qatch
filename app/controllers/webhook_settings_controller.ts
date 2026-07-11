import type { HttpContext } from '@adonisjs/core/http'
import encryption from '@adonisjs/core/services/encryption'

export default class WebhookSettingsController {
  async index({ inertia, auth, request }: HttpContext) {
    const user = auth.user!

    let decryptedApiKey: string | null = null
    if (user.apiKey) {
      decryptedApiKey = encryption.decrypt(user.apiKey) as string
    }

    return inertia.render('webhook-settings/index', {
      apiKey: decryptedApiKey,
      hasHmac: !!user.hmacKey,
      webhookSettings: {
        listenApps: user.webhookListenApps ? user.webhookListenApps.split(',') : [],
        titleWildcard: user.webhookTitleWildcard || '',
        textWildcard: user.webhookTextWildcard || '',
        targetUrl: user.webhookUrl || '',
      },
      webhookUrl: `${request.protocol()}://${request.host()}/api/v1/dynamic-qris/callback`,
    })
  }

  async update({ request, response, auth, session }: HttpContext) {
    const user = auth.user!

    // Validasi input
    const payload = request.only(['listenApps', 'titleWildcard', 'textWildcard', 'targetUrl'])

    user.webhookListenApps = Array.isArray(payload.listenApps)
      ? payload.listenApps.join(',')
      : payload.listenApps || ''

    user.webhookTitleWildcard = payload.titleWildcard || null
    user.webhookTextWildcard = payload.textWildcard || null
    user.webhookUrl = payload.targetUrl || null

    await user.save()

    session.flash('success', 'Pengaturan Webhook berhasil disimpan!')
    return response.redirect().back()
  }
}

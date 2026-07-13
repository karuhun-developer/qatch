import User from '#models/user'
import Plan from '#models/plan'
import type { HttpContext } from '@adonisjs/core/http'

export default class SocialAuthController {
  async redirect({ ally, params }: HttpContext) {
    return ally.use(params.provider).redirect()
  }

  async callback({ ally, params, response, auth, session }: HttpContext) {
    const provider = params.provider as 'github' | 'google'
    const socialAuth = ally.use(provider)

    if (socialAuth.accessDenied()) {
      session.flash('error', 'Login dibatalkan.')
      return response.redirect().toRoute('login')
    }

    if (socialAuth.stateMisMatch()) {
      session.flash('error', 'Request expired. Silakan coba lagi.')
      return response.redirect().toRoute('login')
    }

    if (socialAuth.hasError()) {
      session.flash('error', socialAuth.getError() ?? 'Terjadi kesalahan saat login.')
      return response.redirect().toRoute('login')
    }

    const socialUser = await socialAuth.user()

    if (!socialUser.email) {
      session.flash('error', 'Email tidak ditemukan dari akun social kamu.')
      return response.redirect().toRoute('login')
    }

    // Find user by email
    let user = await User.query().where('email', socialUser.email).first()

    if (!user) {
      // Find default free plan
      const freePlan = await Plan.query().where('price', 0).first()

      // Create a new user with random password
      const randomPassword = Math.random().toString(36).slice(2, 18)
      user = await User.create({
        fullName: socialUser.name || socialUser.nickName || 'User',
        email: socialUser.email,
        password: randomPassword,
        roleId: 2,
        planId: freePlan ? freePlan.id : 1,
      })
    }

    await auth.use('web').login(user)
    return response.redirect().toRoute('dashboard')
  }
}

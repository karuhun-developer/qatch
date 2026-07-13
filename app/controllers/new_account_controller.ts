import User from '#models/user'
import Plan from '#models/plan'
import { signupValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class NewAccountController {
  async create({ inertia }: HttpContext) {
    const plans = await Plan.query().orderBy('price', 'asc')
    return inertia.render('auth/signup', { plans })
  }

  async store({ request, response, auth }: HttpContext) {
    const payload = await request.validateUsing(signupValidator)
    const user = await User.create({ ...payload, roleId: 2 })

    await auth.use('web').login(user)
    response.redirect().toRoute('dashboard')
  }
}

import type { HttpContext } from '@adonisjs/core/http'
import Plan from '#models/plan'

export default class ActivePlanController {
  async index({ inertia }: HttpContext) {
    const plans = await Plan.query().orderBy('price', 'asc')
    
    return inertia.render('active_plan/index', { plans })
  }
}

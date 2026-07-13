import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { PlanService } from '#services/plan_service'

@inject()
export default class HomeController {
  constructor(private planService: PlanService) {}

  async index({ inertia }: HttpContext) {
    const plans = await this.planService.getAllPlans()
    return inertia.render('home', { plans })
  }
}

import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { PlanService } from '#services/plan_service'
import { createPlanValidator, updatePlanValidator } from '#validators/plan'

@inject()
export default class PlansController {
  constructor(private planService: PlanService) {}

  async index({ inertia }: HttpContext) {
    const plans = await this.planService.getAllPlans()
    return inertia.render('plans/index', { plans: plans as any })
  }

  async store({ request, response, session }: HttpContext) {
    const payload = await request.validateUsing(createPlanValidator)
    await this.planService.createPlan(payload)

    session.flash('success', 'Plan created successfully')
    return response.redirect().back()
  }

  async update({ params, request, response, session }: HttpContext) {
    const payload = await request.validateUsing(updatePlanValidator)
    await this.planService.updatePlan(params.id, payload)

    session.flash('success', 'Plan updated successfully')
    return response.redirect().back()
  }

  async destroy({ params, response, session }: HttpContext) {
    await this.planService.deletePlan(params.id)

    session.flash('success', 'Plan deleted successfully')
    return response.redirect().back()
  }
}

import type { HttpContext } from '@adonisjs/core/http'
import Plan from '#models/plan'
import { createPlanValidator, updatePlanValidator } from '#validators/plan'

export default class PlansController {
  async index({ inertia }: HttpContext) {
    const plans = await Plan.query().orderBy('price', 'asc')
    return inertia.render('plans/index', { plans })
  }

  async store({ request, response, session }: HttpContext) {
    const payload = await request.validateUsing(createPlanValidator)
    await Plan.create(payload)

    session.flash('success', 'Plan created successfully')
    return response.redirect().back()
  }

  async update({ params, request, response, session }: HttpContext) {
    const plan = await Plan.findOrFail(params.id)
    const payload = await request.validateUsing(updatePlanValidator)
    
    plan.merge(payload)
    await plan.save()

    session.flash('success', 'Plan updated successfully')
    return response.redirect().back()
  }

  async destroy({ params, response, session }: HttpContext) {
    const plan = await Plan.findOrFail(params.id)
    await plan.delete()

    session.flash('success', 'Plan deleted successfully')
    return response.redirect().back()
  }
}
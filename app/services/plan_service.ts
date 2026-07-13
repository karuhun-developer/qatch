import Plan from '#models/plan'

export class PlanService {
  /**
   * Get all plans ordered by price
   */
  async getAllPlans() {
    return await Plan.query().orderBy('price', 'asc')
  }

  /**
   * Create a new plan
   */
  async createPlan(payload: any) {
    return await Plan.create(payload)
  }

  /**
   * Update an existing plan
   */
  async updatePlan(id: number, payload: any) {
    const plan = await Plan.findOrFail(id)
    plan.merge(payload)
    return await plan.save()
  }

  /**
   * Delete a plan
   */
  async deletePlan(id: number) {
    const plan = await Plan.findOrFail(id)
    return await plan.delete()
  }
}

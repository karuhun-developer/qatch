import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import UserSubscription from '#models/user_subscription'
import { DateTime } from 'luxon'

/**
 * ActivePlanMiddleware
 *
 * Protects dashboard routes so only users with an active (paid) subscription
 * can access them. Superadmin (roleId === 1) bypasses the check entirely.
 *
 * Redirect rules for regular users:
 *  - No active subscription            → redirect to /active-plan
 *  - Has active subscription           → pass through
 *
 * A free plan (price === 0) counts as "active" once activated, so it is NOT
 * blocked. Only paid plans that are still in 'pending' payment are blocked.
 */
export default class ActivePlanMiddleware {
  /** URL that users without an active plan are sent to */
  protected redirectTo = '/active-plan'

  /** Routes that are always allowed (active-plan page itself, logout, etc.) */
  protected allowList = ['/active-plan', '/logout', '/paywuz/webhook']

  async handle(ctx: HttpContext, next: NextFn) {
    const { auth, request, response } = ctx

    // 1. Must be authenticated (auth middleware runs before this)
    const user = auth.user
    if (!user) return next()

    // 2. Superadmin skips the check — no limits, no plan required
    if (user.roleId === 1) return next()

    // 3. Allow the active-plan page and related paths
    const currentPath = request.url()
    if (this.allowList.some((p) => currentPath.startsWith(p))) {
      return next()
    }

    // 4. Check for a valid active subscription
    const now = DateTime.now().toSQL()!

    const activeSubscription = await UserSubscription.query()
      .where('userId', user.id)
      .where('status', 'active')
      .where('ends_at', '>', now)
      .first()

    if (activeSubscription) {
      // All good — user has an active plan
      return next()
    }

    // 5. No active subscription — redirect to /active-plan
    //    For Inertia requests keep it as a normal redirect so the SPA reloads.
    if (request.header('X-Inertia')) {
      return response.redirect(this.redirectTo)
    }

    return response.redirect(this.redirectTo)
  }
}

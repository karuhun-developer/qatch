/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import { middleware } from '#start/kernel'
import { controllers } from '#generated/controllers'
import router from '@adonisjs/core/services/router'

router.get('/', [controllers.Home, 'index']).as('home')
router.get('/docs/:slug?', [controllers.Documentations, 'index']).as('docs')
router.get('/tutorial/:slug?', [controllers.Tutorials, 'index']).as('tutorial')

router.get('/demo', [controllers.Demo, 'index']).as('demo')

router
  .group(() => {
    router.get('register', [controllers.NewAccount, 'create'])
    router.post('register', [controllers.NewAccount, 'store'])

    router.get('login', [controllers.Session, 'create']).as('login')
    router.post('login', [controllers.Session, 'store'])

    // Social Auth
    router.get('auth/:provider/redirect', [controllers.SocialAuth, 'redirect']).as('auth.redirect')
    router.get('auth/:provider/callback', [controllers.SocialAuth, 'callback']).as('auth.callback')
  })
  .use(middleware.guest())

router
  .group(() => {
    // ── These routes are always accessible to authenticated users ─────────────
    // (active-plan, profile, logout, admin pages don't require an active plan)

    router.get('profile', [controllers.Profile, 'index']).as('profile.index')
    router.post('profile/hmac', [controllers.Profile, 'updateHmac']).as('profile.hmac')
    router.post('profile/api-key', [controllers.Profile, 'generateApiKey']).as('profile.apikey')

    // Admin-only routes
    router.get('roles', [controllers.Roles, 'index']).as('roles.index')
    router.post('roles', [controllers.Roles, 'store']).as('roles.store')
    router.put('roles/:id', [controllers.Roles, 'update']).as('roles.update')
    router.delete('roles/:id', [controllers.Roles, 'destroy']).as('roles.destroy')

    router.get('users', [controllers.Users, 'index']).as('users.index')
    router.post('users', [controllers.Users, 'store']).as('users.store')
    router.put('users/:id', [controllers.Users, 'update']).as('users.update')
    router.delete('users/:id', [controllers.Users, 'destroy']).as('users.destroy')

    router.get('plans', [controllers.Plans, 'index']).as('plans.index')
    router.post('plans', [controllers.Plans, 'store']).as('plans.store')
    router.put('plans/:id', [controllers.Plans, 'update']).as('plans.update')
    router.delete('plans/:id', [controllers.Plans, 'destroy']).as('plans.destroy')

    // Active Plan & billing — must stay outside the plan gate so user can pay
    router.get('active-plan', [controllers.ActivePlan, 'index']).as('active-plan.index')
    router
      .post('active-plan/subscribe', [controllers.ActivePlan, 'subscribe'])
      .as('active-plan.subscribe')
    router
      .delete('active-plan/:id/cancel', [controllers.ActivePlan, 'cancelInvoice'])
      .as('active-plan.cancel')

    router.post('logout', [controllers.Session, 'destroy'])
  })
  .use(middleware.auth())

// ── Plan-gated routes — requires an active subscription ───────────────────────
// Superadmin bypasses automatically inside ActivePlanMiddleware.
router
  .group(() => {
    router.get('dashboard', [controllers.Dashboard, 'index']).as('dashboard')

    router.get('qris', [controllers.Qris, 'index']).as('qris.index')
    router.post('qris', [controllers.Qris, 'store']).as('qris.store')
    router.put('qris/:id', [controllers.Qris, 'update']).as('qris.update')
    router.delete('qris/:id', [controllers.Qris, 'destroy']).as('qris.destroy')

    router
      .get('webhook-settings', [controllers.WebhookSettings, 'index'])
      .as('webhook-settings.index')
    router
      .post('webhook-settings', [controllers.WebhookSettings, 'update'])
      .as('webhook-settings.update')

    router.get('qris-dynamic', [controllers.DynamicQris, 'index']).as('qris-dynamic.index')
    router.post('qris-dynamic', [controllers.DynamicQris, 'store']).as('qris-dynamic.store')
    router
      .post('qris-dynamic/:id/status', [controllers.DynamicQris, 'updateStatus'])
      .as('qris-dynamic.status')
  })
  .use([middleware.auth(), middleware.activePlan()])

// API Routes
router
  .group(() => {
    // Static QRIS API
    router.get('static-qris', [controllers.api.v1.StaticQris, 'index'])
    router.post('static-qris', [controllers.api.v1.StaticQris, 'store'])
    router.get('static-qris/:id', [controllers.api.v1.StaticQris, 'show'])
    router.put('static-qris/:id', [controllers.api.v1.StaticQris, 'update'])
    router.delete('static-qris/:id', [controllers.api.v1.StaticQris, 'destroy'])

    // Dynamic QRIS API
    router.post('dynamic-qris', [controllers.api.v1.DynamicQris, 'store'])
    router.get('dynamic-qris/:id', [controllers.api.v1.DynamicQris, 'show'])
    router.put('dynamic-qris/:id', [controllers.api.v1.DynamicQris, 'update'])

    // Callback Webhook
    router.post('dynamic-qris/callback', [controllers.api.v1.DynamicQris, 'callback'])
  })
  .prefix('api/v1')
  .use([middleware.apiKey(), middleware.forceJsonReponse()])

// Paywuz Webhook — public endpoint, no auth needed
router.post('api/v1/paywuz/webhook', [controllers.ActivePlan, 'webhook']).as('paywuz.webhook')

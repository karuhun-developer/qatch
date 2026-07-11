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

router.on('/').renderInertia('home', {}).as('home')

router
  .group(() => {
    router.get('register', [controllers.NewAccount, 'create'])
    router.post('register', [controllers.NewAccount, 'store'])

    router.get('login', [controllers.Session, 'create'])
    router.post('login', [controllers.Session, 'store'])
  })
  .use(middleware.guest())

router
  .group(() => {
    router.get('dashboard', async ({ inertia, auth }) => {
      const user = auth.user!
      const encryption = (await import('@adonisjs/core/services/encryption')).default
      
      let decryptedApiKey: string | null = null
      if (user.apiKey) {
        decryptedApiKey = encryption.decrypt(user.apiKey) as string
      }
      
      return inertia.render('dashboard', {
        apiKey: decryptedApiKey,
        hasHmac: !!user.hmacKey
      })
    }).as('dashboard')
    router.get('profile', [controllers.Profile, 'index']).as('profile.index')
    router.post('profile/hmac', [controllers.Profile, 'updateHmac']).as('profile.hmac')
    router.post('profile/api-key', [controllers.Profile, 'generateApiKey']).as('profile.apikey')
    router.get('roles', [controllers.Roles, 'index']).as('roles.index')
    router.post('roles', [controllers.Roles, 'store']).as('roles.store')
    router.put('roles/:id', [controllers.Roles, 'update']).as('roles.update')
    router.delete('roles/:id', [controllers.Roles, 'destroy']).as('roles.destroy')
    
    router.get('users', [controllers.Users, 'index']).as('users.index')
    router.post('users', [controllers.Users, 'store']).as('users.store')
    router.put('users/:id', [controllers.Users, 'update']).as('users.update')
    router.delete('users/:id', [controllers.Users, 'destroy']).as('users.destroy')
    
    router.get('qris', [controllers.Qris, 'index']).as('qris.index')
    router.post('qris', [controllers.Qris, 'store']).as('qris.store')
    router.put('qris/:id', [controllers.Qris, 'update']).as('qris.update')
    router.delete('qris/:id', [controllers.Qris, 'destroy']).as('qris.destroy')
    
    router.get('qris-dynamic', [controllers.DynamicQris, 'index']).as('qris-dynamic.index')
    router.post('qris-dynamic', [controllers.DynamicQris, 'store']).as('qris-dynamic.store')
    router.post('qris-dynamic/:id/status', [controllers.DynamicQris, 'updateStatus']).as('qris-dynamic.status')
    
    router.post('logout', [controllers.Session, 'destroy'])
  })
  .use(middleware.auth())

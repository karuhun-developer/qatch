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
    router.on('dashboard').renderInertia('dashboard', {}).as('dashboard')
    router.on('profile').renderInertia('profile', {}).as('profile')
    router.get('roles', [controllers.Roles, 'index']).as('roles.index')
    router.post('roles', [controllers.Roles, 'store']).as('roles.store')
    router.put('roles/:id', [controllers.Roles, 'update']).as('roles.update')
    router.delete('roles/:id', [controllers.Roles, 'destroy']).as('roles.destroy')
    
    router.get('users', [controllers.Users, 'index']).as('users.index')
    router.post('users', [controllers.Users, 'store']).as('users.store')
    router.put('users/:id', [controllers.Users, 'update']).as('users.update')
    router.delete('users/:id', [controllers.Users, 'destroy']).as('users.destroy')
    router.post('logout', [controllers.Session, 'destroy'])
  })
  .use(middleware.auth())

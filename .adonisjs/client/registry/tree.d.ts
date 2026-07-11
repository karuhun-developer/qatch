/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  home: typeof routes['home']
  newAccount: {
    create: typeof routes['new_account.create']
    store: typeof routes['new_account.store']
  }
  session: {
    create: typeof routes['session.create']
    store: typeof routes['session.store']
    destroy: typeof routes['session.destroy']
  }
  dashboard: typeof routes['dashboard']
  profile: typeof routes['profile']
  roles: {
    index: typeof routes['roles.index']
    store: typeof routes['roles.store']
    update: typeof routes['roles.update']
    destroy: typeof routes['roles.destroy']
  }
  users: {
    index: typeof routes['users.index']
    store: typeof routes['users.store']
    update: typeof routes['users.update']
    destroy: typeof routes['users.destroy']
  }
}

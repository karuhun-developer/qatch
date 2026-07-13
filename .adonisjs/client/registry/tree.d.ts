/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  home: typeof routes['home']
  docs: typeof routes['docs']
  demo: typeof routes['demo']
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
  profile: {
    index: typeof routes['profile.index']
    hmac: typeof routes['profile.hmac']
    apikey: typeof routes['profile.apikey']
  }
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
  plans: {
    index: typeof routes['plans.index']
    store: typeof routes['plans.store']
    update: typeof routes['plans.update']
    destroy: typeof routes['plans.destroy']
  }
  qris: {
    index: typeof routes['qris.index']
    store: typeof routes['qris.store']
    update: typeof routes['qris.update']
    destroy: typeof routes['qris.destroy']
  }
  webhookSettings: {
    index: typeof routes['webhook-settings.index']
    update: typeof routes['webhook-settings.update']
  }
  qrisDynamic: {
    index: typeof routes['qris-dynamic.index']
    store: typeof routes['qris-dynamic.store']
    status: typeof routes['qris-dynamic.status']
  }
  staticQris: {
    index: typeof routes['static_qris.index']
    store: typeof routes['static_qris.store']
    show: typeof routes['static_qris.show']
    update: typeof routes['static_qris.update']
    destroy: typeof routes['static_qris.destroy']
  }
  dynamicQris: {
    store: typeof routes['dynamic_qris.store']
    show: typeof routes['dynamic_qris.show']
    update: typeof routes['dynamic_qris.update']
    callback: typeof routes['dynamic_qris.callback']
  }
}

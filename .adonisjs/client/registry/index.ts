/* eslint-disable prettier/prettier */
import type { AdonisEndpoint } from '@tuyau/core/types'
import type { Registry } from './schema.d.ts'
import type { ApiDefinition } from './tree.d.ts'

const placeholder: any = {}

const routes = {
  'home': {
    methods: ["GET","HEAD"],
    pattern: '/',
    tokens: [{"old":"/","type":0,"val":"/","end":""}],
    types: placeholder as Registry['home']['types'],
  },
  'docs': {
    methods: ["GET","HEAD"],
    pattern: '/docs/:slug?',
    tokens: [{"old":"/docs/:slug?","type":0,"val":"docs","end":""},{"old":"/docs/:slug?","type":3,"val":"slug","end":""}],
    types: placeholder as Registry['docs']['types'],
  },
  'tutorial': {
    methods: ["GET","HEAD"],
    pattern: '/tutorial/:slug?',
    tokens: [{"old":"/tutorial/:slug?","type":0,"val":"tutorial","end":""},{"old":"/tutorial/:slug?","type":3,"val":"slug","end":""}],
    types: placeholder as Registry['tutorial']['types'],
  },
  'demo': {
    methods: ["GET","HEAD"],
    pattern: '/demo',
    tokens: [{"old":"/demo","type":0,"val":"demo","end":""}],
    types: placeholder as Registry['demo']['types'],
  },
  'new_account.create': {
    methods: ["GET","HEAD"],
    pattern: '/register',
    tokens: [{"old":"/register","type":0,"val":"register","end":""}],
    types: placeholder as Registry['new_account.create']['types'],
  },
  'new_account.store': {
    methods: ["POST"],
    pattern: '/register',
    tokens: [{"old":"/register","type":0,"val":"register","end":""}],
    types: placeholder as Registry['new_account.store']['types'],
  },
  'login': {
    methods: ["GET","HEAD"],
    pattern: '/login',
    tokens: [{"old":"/login","type":0,"val":"login","end":""}],
    types: placeholder as Registry['login']['types'],
  },
  'session.store': {
    methods: ["POST"],
    pattern: '/login',
    tokens: [{"old":"/login","type":0,"val":"login","end":""}],
    types: placeholder as Registry['session.store']['types'],
  },
  'auth.redirect': {
    methods: ["GET","HEAD"],
    pattern: '/auth/:provider/redirect',
    tokens: [{"old":"/auth/:provider/redirect","type":0,"val":"auth","end":""},{"old":"/auth/:provider/redirect","type":1,"val":"provider","end":""},{"old":"/auth/:provider/redirect","type":0,"val":"redirect","end":""}],
    types: placeholder as Registry['auth.redirect']['types'],
  },
  'auth.callback': {
    methods: ["GET","HEAD"],
    pattern: '/auth/:provider/callback',
    tokens: [{"old":"/auth/:provider/callback","type":0,"val":"auth","end":""},{"old":"/auth/:provider/callback","type":1,"val":"provider","end":""},{"old":"/auth/:provider/callback","type":0,"val":"callback","end":""}],
    types: placeholder as Registry['auth.callback']['types'],
  },
  'profile.index': {
    methods: ["GET","HEAD"],
    pattern: '/profile',
    tokens: [{"old":"/profile","type":0,"val":"profile","end":""}],
    types: placeholder as Registry['profile.index']['types'],
  },
  'profile.hmac': {
    methods: ["POST"],
    pattern: '/profile/hmac',
    tokens: [{"old":"/profile/hmac","type":0,"val":"profile","end":""},{"old":"/profile/hmac","type":0,"val":"hmac","end":""}],
    types: placeholder as Registry['profile.hmac']['types'],
  },
  'profile.apikey': {
    methods: ["POST"],
    pattern: '/profile/api-key',
    tokens: [{"old":"/profile/api-key","type":0,"val":"profile","end":""},{"old":"/profile/api-key","type":0,"val":"api-key","end":""}],
    types: placeholder as Registry['profile.apikey']['types'],
  },
  'roles.index': {
    methods: ["GET","HEAD"],
    pattern: '/roles',
    tokens: [{"old":"/roles","type":0,"val":"roles","end":""}],
    types: placeholder as Registry['roles.index']['types'],
  },
  'roles.store': {
    methods: ["POST"],
    pattern: '/roles',
    tokens: [{"old":"/roles","type":0,"val":"roles","end":""}],
    types: placeholder as Registry['roles.store']['types'],
  },
  'roles.update': {
    methods: ["PUT"],
    pattern: '/roles/:id',
    tokens: [{"old":"/roles/:id","type":0,"val":"roles","end":""},{"old":"/roles/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['roles.update']['types'],
  },
  'roles.destroy': {
    methods: ["DELETE"],
    pattern: '/roles/:id',
    tokens: [{"old":"/roles/:id","type":0,"val":"roles","end":""},{"old":"/roles/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['roles.destroy']['types'],
  },
  'users.index': {
    methods: ["GET","HEAD"],
    pattern: '/users',
    tokens: [{"old":"/users","type":0,"val":"users","end":""}],
    types: placeholder as Registry['users.index']['types'],
  },
  'users.store': {
    methods: ["POST"],
    pattern: '/users',
    tokens: [{"old":"/users","type":0,"val":"users","end":""}],
    types: placeholder as Registry['users.store']['types'],
  },
  'users.update': {
    methods: ["PUT"],
    pattern: '/users/:id',
    tokens: [{"old":"/users/:id","type":0,"val":"users","end":""},{"old":"/users/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['users.update']['types'],
  },
  'users.destroy': {
    methods: ["DELETE"],
    pattern: '/users/:id',
    tokens: [{"old":"/users/:id","type":0,"val":"users","end":""},{"old":"/users/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['users.destroy']['types'],
  },
  'plans.index': {
    methods: ["GET","HEAD"],
    pattern: '/plans',
    tokens: [{"old":"/plans","type":0,"val":"plans","end":""}],
    types: placeholder as Registry['plans.index']['types'],
  },
  'plans.store': {
    methods: ["POST"],
    pattern: '/plans',
    tokens: [{"old":"/plans","type":0,"val":"plans","end":""}],
    types: placeholder as Registry['plans.store']['types'],
  },
  'plans.update': {
    methods: ["PUT"],
    pattern: '/plans/:id',
    tokens: [{"old":"/plans/:id","type":0,"val":"plans","end":""},{"old":"/plans/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['plans.update']['types'],
  },
  'plans.destroy': {
    methods: ["DELETE"],
    pattern: '/plans/:id',
    tokens: [{"old":"/plans/:id","type":0,"val":"plans","end":""},{"old":"/plans/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['plans.destroy']['types'],
  },
  'active-plan.index': {
    methods: ["GET","HEAD"],
    pattern: '/active-plan',
    tokens: [{"old":"/active-plan","type":0,"val":"active-plan","end":""}],
    types: placeholder as Registry['active-plan.index']['types'],
  },
  'active-plan.subscribe': {
    methods: ["POST"],
    pattern: '/active-plan/subscribe',
    tokens: [{"old":"/active-plan/subscribe","type":0,"val":"active-plan","end":""},{"old":"/active-plan/subscribe","type":0,"val":"subscribe","end":""}],
    types: placeholder as Registry['active-plan.subscribe']['types'],
  },
  'active-plan.cancel': {
    methods: ["DELETE"],
    pattern: '/active-plan/:id/cancel',
    tokens: [{"old":"/active-plan/:id/cancel","type":0,"val":"active-plan","end":""},{"old":"/active-plan/:id/cancel","type":1,"val":"id","end":""},{"old":"/active-plan/:id/cancel","type":0,"val":"cancel","end":""}],
    types: placeholder as Registry['active-plan.cancel']['types'],
  },
  'session.destroy': {
    methods: ["POST"],
    pattern: '/logout',
    tokens: [{"old":"/logout","type":0,"val":"logout","end":""}],
    types: placeholder as Registry['session.destroy']['types'],
  },
  'dashboard': {
    methods: ["GET","HEAD"],
    pattern: '/dashboard',
    tokens: [{"old":"/dashboard","type":0,"val":"dashboard","end":""}],
    types: placeholder as Registry['dashboard']['types'],
  },
  'qris.index': {
    methods: ["GET","HEAD"],
    pattern: '/qris',
    tokens: [{"old":"/qris","type":0,"val":"qris","end":""}],
    types: placeholder as Registry['qris.index']['types'],
  },
  'qris.store': {
    methods: ["POST"],
    pattern: '/qris',
    tokens: [{"old":"/qris","type":0,"val":"qris","end":""}],
    types: placeholder as Registry['qris.store']['types'],
  },
  'qris.update': {
    methods: ["PUT"],
    pattern: '/qris/:id',
    tokens: [{"old":"/qris/:id","type":0,"val":"qris","end":""},{"old":"/qris/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['qris.update']['types'],
  },
  'qris.destroy': {
    methods: ["DELETE"],
    pattern: '/qris/:id',
    tokens: [{"old":"/qris/:id","type":0,"val":"qris","end":""},{"old":"/qris/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['qris.destroy']['types'],
  },
  'webhook-settings.index': {
    methods: ["GET","HEAD"],
    pattern: '/webhook-settings',
    tokens: [{"old":"/webhook-settings","type":0,"val":"webhook-settings","end":""}],
    types: placeholder as Registry['webhook-settings.index']['types'],
  },
  'webhook-settings.update': {
    methods: ["POST"],
    pattern: '/webhook-settings',
    tokens: [{"old":"/webhook-settings","type":0,"val":"webhook-settings","end":""}],
    types: placeholder as Registry['webhook-settings.update']['types'],
  },
  'qris-dynamic.index': {
    methods: ["GET","HEAD"],
    pattern: '/qris-dynamic',
    tokens: [{"old":"/qris-dynamic","type":0,"val":"qris-dynamic","end":""}],
    types: placeholder as Registry['qris-dynamic.index']['types'],
  },
  'qris-dynamic.store': {
    methods: ["POST"],
    pattern: '/qris-dynamic',
    tokens: [{"old":"/qris-dynamic","type":0,"val":"qris-dynamic","end":""}],
    types: placeholder as Registry['qris-dynamic.store']['types'],
  },
  'qris-dynamic.status': {
    methods: ["POST"],
    pattern: '/qris-dynamic/:id/status',
    tokens: [{"old":"/qris-dynamic/:id/status","type":0,"val":"qris-dynamic","end":""},{"old":"/qris-dynamic/:id/status","type":1,"val":"id","end":""},{"old":"/qris-dynamic/:id/status","type":0,"val":"status","end":""}],
    types: placeholder as Registry['qris-dynamic.status']['types'],
  },
  'static_qris.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/static-qris',
    tokens: [{"old":"/api/v1/static-qris","type":0,"val":"api","end":""},{"old":"/api/v1/static-qris","type":0,"val":"v1","end":""},{"old":"/api/v1/static-qris","type":0,"val":"static-qris","end":""}],
    types: placeholder as Registry['static_qris.index']['types'],
  },
  'static_qris.store': {
    methods: ["POST"],
    pattern: '/api/v1/static-qris',
    tokens: [{"old":"/api/v1/static-qris","type":0,"val":"api","end":""},{"old":"/api/v1/static-qris","type":0,"val":"v1","end":""},{"old":"/api/v1/static-qris","type":0,"val":"static-qris","end":""}],
    types: placeholder as Registry['static_qris.store']['types'],
  },
  'static_qris.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/static-qris/:id',
    tokens: [{"old":"/api/v1/static-qris/:id","type":0,"val":"api","end":""},{"old":"/api/v1/static-qris/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/static-qris/:id","type":0,"val":"static-qris","end":""},{"old":"/api/v1/static-qris/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['static_qris.show']['types'],
  },
  'static_qris.update': {
    methods: ["PUT"],
    pattern: '/api/v1/static-qris/:id',
    tokens: [{"old":"/api/v1/static-qris/:id","type":0,"val":"api","end":""},{"old":"/api/v1/static-qris/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/static-qris/:id","type":0,"val":"static-qris","end":""},{"old":"/api/v1/static-qris/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['static_qris.update']['types'],
  },
  'static_qris.destroy': {
    methods: ["DELETE"],
    pattern: '/api/v1/static-qris/:id',
    tokens: [{"old":"/api/v1/static-qris/:id","type":0,"val":"api","end":""},{"old":"/api/v1/static-qris/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/static-qris/:id","type":0,"val":"static-qris","end":""},{"old":"/api/v1/static-qris/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['static_qris.destroy']['types'],
  },
  'dynamic_qris.store': {
    methods: ["POST"],
    pattern: '/api/v1/dynamic-qris',
    tokens: [{"old":"/api/v1/dynamic-qris","type":0,"val":"api","end":""},{"old":"/api/v1/dynamic-qris","type":0,"val":"v1","end":""},{"old":"/api/v1/dynamic-qris","type":0,"val":"dynamic-qris","end":""}],
    types: placeholder as Registry['dynamic_qris.store']['types'],
  },
  'dynamic_qris.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/dynamic-qris/:id',
    tokens: [{"old":"/api/v1/dynamic-qris/:id","type":0,"val":"api","end":""},{"old":"/api/v1/dynamic-qris/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/dynamic-qris/:id","type":0,"val":"dynamic-qris","end":""},{"old":"/api/v1/dynamic-qris/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['dynamic_qris.show']['types'],
  },
  'dynamic_qris.update': {
    methods: ["PUT"],
    pattern: '/api/v1/dynamic-qris/:id',
    tokens: [{"old":"/api/v1/dynamic-qris/:id","type":0,"val":"api","end":""},{"old":"/api/v1/dynamic-qris/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/dynamic-qris/:id","type":0,"val":"dynamic-qris","end":""},{"old":"/api/v1/dynamic-qris/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['dynamic_qris.update']['types'],
  },
  'dynamic_qris.callback': {
    methods: ["POST"],
    pattern: '/api/v1/dynamic-qris/callback',
    tokens: [{"old":"/api/v1/dynamic-qris/callback","type":0,"val":"api","end":""},{"old":"/api/v1/dynamic-qris/callback","type":0,"val":"v1","end":""},{"old":"/api/v1/dynamic-qris/callback","type":0,"val":"dynamic-qris","end":""},{"old":"/api/v1/dynamic-qris/callback","type":0,"val":"callback","end":""}],
    types: placeholder as Registry['dynamic_qris.callback']['types'],
  },
  'paywuz.webhook': {
    methods: ["POST"],
    pattern: '/api/v1/paywuz/webhook',
    tokens: [{"old":"/api/v1/paywuz/webhook","type":0,"val":"api","end":""},{"old":"/api/v1/paywuz/webhook","type":0,"val":"v1","end":""},{"old":"/api/v1/paywuz/webhook","type":0,"val":"paywuz","end":""},{"old":"/api/v1/paywuz/webhook","type":0,"val":"webhook","end":""}],
    types: placeholder as Registry['paywuz.webhook']['types'],
  },
} as const satisfies Record<string, AdonisEndpoint>

export { routes }

export const registry = {
  routes,
  $tree: {} as ApiDefinition,
}

declare module '@tuyau/core/types' {
  export interface UserRegistry {
    routes: typeof routes
    $tree: ApiDefinition
  }
}

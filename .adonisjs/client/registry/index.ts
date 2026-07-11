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
  'session.create': {
    methods: ["GET","HEAD"],
    pattern: '/login',
    tokens: [{"old":"/login","type":0,"val":"login","end":""}],
    types: placeholder as Registry['session.create']['types'],
  },
  'session.store': {
    methods: ["POST"],
    pattern: '/login',
    tokens: [{"old":"/login","type":0,"val":"login","end":""}],
    types: placeholder as Registry['session.store']['types'],
  },
  'dashboard': {
    methods: ["GET","HEAD"],
    pattern: '/dashboard',
    tokens: [{"old":"/dashboard","type":0,"val":"dashboard","end":""}],
    types: placeholder as Registry['dashboard']['types'],
  },
  'profile': {
    methods: ["GET","HEAD"],
    pattern: '/profile',
    tokens: [{"old":"/profile","type":0,"val":"profile","end":""}],
    types: placeholder as Registry['profile']['types'],
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
  'session.destroy': {
    methods: ["POST"],
    pattern: '/logout',
    tokens: [{"old":"/logout","type":0,"val":"logout","end":""}],
    types: placeholder as Registry['session.destroy']['types'],
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

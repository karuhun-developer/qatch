/* eslint-disable prettier/prettier */
/// <reference path="../manifest.d.ts" />

import type { ExtractBody, ExtractErrorResponse, ExtractQuery, ExtractQueryForGet, ExtractResponse } from '@tuyau/core/types'
import type { InferInput, SimpleError } from '@vinejs/vine/types'

export type ParamValue = string | number | bigint | boolean

export interface Registry {
  'home': {
    methods: ["GET","HEAD"]
    pattern: '/'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'new_account.create': {
    methods: ["GET","HEAD"]
    pattern: '/register'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/new_account_controller').default['create']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/new_account_controller').default['create']>>>
    }
  }
  'new_account.store': {
    methods: ["POST"]
    pattern: '/register'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/user').signupValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/user').signupValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/new_account_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/new_account_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'session.create': {
    methods: ["GET","HEAD"]
    pattern: '/login'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/session_controller').default['create']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/session_controller').default['create']>>>
    }
  }
  'session.store': {
    methods: ["POST"]
    pattern: '/login'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/session_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/session_controller').default['store']>>>
    }
  }
  'dashboard': {
    methods: ["GET","HEAD"]
    pattern: '/dashboard'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/dashboard_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/dashboard_controller').default['index']>>>
    }
  }
  'profile.index': {
    methods: ["GET","HEAD"]
    pattern: '/profile'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/profile_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/profile_controller').default['index']>>>
    }
  }
  'profile.hmac': {
    methods: ["POST"]
    pattern: '/profile/hmac'
    types: {
      body: ExtractBody<InferInput<(typeof import('@vinejs/vine').default)['compile']>|InferInput<(typeof import('@vinejs/vine').default)['object']>|InferInput<(typeof import('@vinejs/vine').default)['string()']['trim()']['minLength']>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('@vinejs/vine').default)['compile']>|InferInput<(typeof import('@vinejs/vine').default)['object']>|InferInput<(typeof import('@vinejs/vine').default)['string()']['trim()']['minLength']>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/profile_controller').default['updateHmac']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/profile_controller').default['updateHmac']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'profile.apikey': {
    methods: ["POST"]
    pattern: '/profile/api-key'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/profile_controller').default['generateApiKey']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/profile_controller').default['generateApiKey']>>>
    }
  }
  'roles.index': {
    methods: ["GET","HEAD"]
    pattern: '/roles'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/roles_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/roles_controller').default['index']>>>
    }
  }
  'roles.store': {
    methods: ["POST"]
    pattern: '/roles'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/role').createRoleValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/role').createRoleValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/roles_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/roles_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'roles.update': {
    methods: ["PUT"]
    pattern: '/roles/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/role').updateRoleValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/role').updateRoleValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/roles_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/roles_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'roles.destroy': {
    methods: ["DELETE"]
    pattern: '/roles/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/roles_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/roles_controller').default['destroy']>>>
    }
  }
  'users.index': {
    methods: ["GET","HEAD"]
    pattern: '/users'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/users_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/users_controller').default['index']>>>
    }
  }
  'users.store': {
    methods: ["POST"]
    pattern: '/users'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/user').createUserValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/user').createUserValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/users_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/users_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'users.update': {
    methods: ["PUT"]
    pattern: '/users/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/user').updateUserValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/user').updateUserValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/users_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/users_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'users.destroy': {
    methods: ["DELETE"]
    pattern: '/users/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/users_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/users_controller').default['destroy']>>>
    }
  }
  'qris.index': {
    methods: ["GET","HEAD"]
    pattern: '/qris'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/qris_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/qris_controller').default['index']>>>
    }
  }
  'qris.store': {
    methods: ["POST"]
    pattern: '/qris'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/qris').createQrisValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/qris').createQrisValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/qris_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/qris_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'qris.update': {
    methods: ["PUT"]
    pattern: '/qris/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/qris').updateQrisValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/qris').updateQrisValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/qris_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/qris_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'qris.destroy': {
    methods: ["DELETE"]
    pattern: '/qris/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/qris_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/qris_controller').default['destroy']>>>
    }
  }
  'webhook-settings.index': {
    methods: ["GET","HEAD"]
    pattern: '/webhook-settings'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/webhook_settings_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/webhook_settings_controller').default['index']>>>
    }
  }
  'webhook-settings.update': {
    methods: ["POST"]
    pattern: '/webhook-settings'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/webhook_settings_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/webhook_settings_controller').default['update']>>>
    }
  }
  'qris-dynamic.index': {
    methods: ["GET","HEAD"]
    pattern: '/qris-dynamic'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/dynamic_qris_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/dynamic_qris_controller').default['index']>>>
    }
  }
  'qris-dynamic.store': {
    methods: ["POST"]
    pattern: '/qris-dynamic'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/qris_transaction').generateDynamicQrisValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/qris_transaction').generateDynamicQrisValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/dynamic_qris_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/dynamic_qris_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'qris-dynamic.status': {
    methods: ["POST"]
    pattern: '/qris-dynamic/:id/status'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/dynamic_qris_controller').default['updateStatus']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/dynamic_qris_controller').default['updateStatus']>>>
    }
  }
  'session.destroy': {
    methods: ["POST"]
    pattern: '/logout'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/session_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/session_controller').default['destroy']>>>
    }
  }
  'static_qris.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/static-qris'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'static_qris.store': {
    methods: ["POST"]
    pattern: '/api/v1/static-qris'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'static_qris.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/static-qris/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'static_qris.update': {
    methods: ["PUT"]
    pattern: '/api/v1/static-qris/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'static_qris.destroy': {
    methods: ["DELETE"]
    pattern: '/api/v1/static-qris/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'dynamic_qris.store': {
    methods: ["POST"]
    pattern: '/api/v1/dynamic-qris'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'dynamic_qris.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/dynamic-qris/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'dynamic_qris.update': {
    methods: ["PUT"]
    pattern: '/api/v1/dynamic-qris/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'dynamic_qris.callback': {
    methods: ["POST"]
    pattern: '/api/v1/dynamic-qris/callback'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
}

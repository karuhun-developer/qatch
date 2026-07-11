import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'home': { paramsTuple?: []; params?: {} }
    'new_account.create': { paramsTuple?: []; params?: {} }
    'new_account.store': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'session.store': { paramsTuple?: []; params?: {} }
    'dashboard': { paramsTuple?: []; params?: {} }
    'profile.index': { paramsTuple?: []; params?: {} }
    'profile.hmac': { paramsTuple?: []; params?: {} }
    'profile.apikey': { paramsTuple?: []; params?: {} }
    'roles.index': { paramsTuple?: []; params?: {} }
    'roles.store': { paramsTuple?: []; params?: {} }
    'roles.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'roles.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'users.index': { paramsTuple?: []; params?: {} }
    'users.store': { paramsTuple?: []; params?: {} }
    'users.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'users.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'qris.index': { paramsTuple?: []; params?: {} }
    'qris.store': { paramsTuple?: []; params?: {} }
    'qris.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'qris.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'webhook-settings.index': { paramsTuple?: []; params?: {} }
    'webhook-settings.update': { paramsTuple?: []; params?: {} }
    'qris-dynamic.index': { paramsTuple?: []; params?: {} }
    'qris-dynamic.store': { paramsTuple?: []; params?: {} }
    'qris-dynamic.status': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'session.destroy': { paramsTuple?: []; params?: {} }
    'static_qris.index': { paramsTuple?: []; params?: {} }
    'static_qris.store': { paramsTuple?: []; params?: {} }
    'static_qris.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'static_qris.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'static_qris.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'dynamic_qris.store': { paramsTuple?: []; params?: {} }
    'dynamic_qris.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'dynamic_qris.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'dynamic_qris.callback': { paramsTuple?: []; params?: {} }
  }
  GET: {
    'home': { paramsTuple?: []; params?: {} }
    'new_account.create': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'dashboard': { paramsTuple?: []; params?: {} }
    'profile.index': { paramsTuple?: []; params?: {} }
    'roles.index': { paramsTuple?: []; params?: {} }
    'users.index': { paramsTuple?: []; params?: {} }
    'qris.index': { paramsTuple?: []; params?: {} }
    'webhook-settings.index': { paramsTuple?: []; params?: {} }
    'qris-dynamic.index': { paramsTuple?: []; params?: {} }
    'static_qris.index': { paramsTuple?: []; params?: {} }
    'static_qris.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'dynamic_qris.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  HEAD: {
    'home': { paramsTuple?: []; params?: {} }
    'new_account.create': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'dashboard': { paramsTuple?: []; params?: {} }
    'profile.index': { paramsTuple?: []; params?: {} }
    'roles.index': { paramsTuple?: []; params?: {} }
    'users.index': { paramsTuple?: []; params?: {} }
    'qris.index': { paramsTuple?: []; params?: {} }
    'webhook-settings.index': { paramsTuple?: []; params?: {} }
    'qris-dynamic.index': { paramsTuple?: []; params?: {} }
    'static_qris.index': { paramsTuple?: []; params?: {} }
    'static_qris.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'dynamic_qris.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  POST: {
    'new_account.store': { paramsTuple?: []; params?: {} }
    'session.store': { paramsTuple?: []; params?: {} }
    'profile.hmac': { paramsTuple?: []; params?: {} }
    'profile.apikey': { paramsTuple?: []; params?: {} }
    'roles.store': { paramsTuple?: []; params?: {} }
    'users.store': { paramsTuple?: []; params?: {} }
    'qris.store': { paramsTuple?: []; params?: {} }
    'webhook-settings.update': { paramsTuple?: []; params?: {} }
    'qris-dynamic.store': { paramsTuple?: []; params?: {} }
    'qris-dynamic.status': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'session.destroy': { paramsTuple?: []; params?: {} }
    'static_qris.store': { paramsTuple?: []; params?: {} }
    'dynamic_qris.store': { paramsTuple?: []; params?: {} }
    'dynamic_qris.callback': { paramsTuple?: []; params?: {} }
  }
  PUT: {
    'roles.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'users.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'qris.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'static_qris.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'dynamic_qris.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  DELETE: {
    'roles.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'users.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'qris.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'static_qris.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}
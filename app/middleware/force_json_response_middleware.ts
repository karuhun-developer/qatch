import { HttpContext } from '@adonisjs/core/http'
import { NextFn } from '@adonisjs/core/types/http'

export default class ForceJsonResponseMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    // Force the framework to think the client expects JSON
    ctx.request.headers().accept = 'application/json'

    return await next()
  }
}

import type { HttpContext } from '@adonisjs/core/http'
import { createRoleValidator, updateRoleValidator } from '#validators/role'
import { inject } from '@adonisjs/core'
import RoleService from '#services/role_service'
import { manageRoles } from '#abilities/main'

@inject()
export default class RolesController {
  constructor(protected roleService: RoleService) {}

  async index({ request, inertia, bouncer, response }: HttpContext) {
    if (await bouncer.denies(manageRoles)) {
      return response.redirect().toRoute('dashboard')
    }
    
    const page = request.input('page', 1)
    const roles = await this.roleService.getPaginatedRoles(page, 10)
    return inertia.render('roles/index', { roles: roles.serialize() as any })
  }

  async store({ request, response, bouncer, session }: HttpContext) {
    if (await bouncer.denies(manageRoles)) {
      return response.unauthorized('You are not authorized')
    }

    const payload = await request.validateUsing(createRoleValidator)
    
    await this.roleService.createRole(payload.name)
    session.flash('success', 'Role berhasil dibuat!')

    return response.redirect().back()
  }

  async update({ params, request, response, bouncer, session }: HttpContext) {
    if (await bouncer.denies(manageRoles)) {
      return response.unauthorized('You are not authorized')
    }

    const payload = await request.validateUsing(updateRoleValidator, { meta: { roleId: params.id } })
    
    await this.roleService.updateRole(params.id, payload.name)
    session.flash('success', 'Role berhasil diperbarui!')

    return response.redirect().back()
  }

  async destroy({ params, response, bouncer, session }: HttpContext) {
    if (await bouncer.denies(manageRoles)) {
      return response.unauthorized('You are not authorized')
    }

    await this.roleService.deleteRole(params.id)
    session.flash('success', 'Role berhasil dihapus!')

    return response.redirect().back()
  }
}
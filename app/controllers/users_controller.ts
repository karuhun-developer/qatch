import type { HttpContext } from '@adonisjs/core/http'
import { createUserValidator, updateUserValidator } from '#validators/user'
import { inject } from '@adonisjs/core'
import UserService from '#services/user_service'
import RoleService from '#services/role_service'
import { manageUsers } from '#abilities/main'

@inject()
export default class UsersController {
  constructor(
    protected userService: UserService,
    protected roleService: RoleService
  ) {}

  async index({ request, inertia, bouncer, response }: HttpContext) {
    if (await bouncer.denies(manageUsers)) {
      return response.redirect().toRoute('dashboard')
    }
    
    const page = request.input('page', 1)
    const users = await this.userService.getPaginatedUsers(page, 10)
    const roles = await this.roleService.getAllRoles()
    
    return inertia.render('users/index', { 
      users: users.serialize() as any,
      roles: roles.map(r => r.serialize()) as any
    })
  }

  async store({ request, response, bouncer, session }: HttpContext) {
    if (await bouncer.denies(manageUsers)) {
      return response.unauthorized('You are not authorized')
    }

    const payload = await request.validateUsing(createUserValidator)
    
    await this.userService.createUser(payload)
    session.flash('success', 'User berhasil dibuat!')

    return response.redirect().back()
  }

  async update({ params, request, response, bouncer, session }: HttpContext) {
    if (await bouncer.denies(manageUsers)) {
      return response.unauthorized('You are not authorized')
    }

    const payload = await request.validateUsing(updateUserValidator, { meta: { userId: params.id } })
    
    // If password is not provided, don't update it
    const dataToUpdate: any = {
      fullName: payload.fullName,
      email: payload.email,
      roleId: payload.roleId
    }

    if (payload.password) {
      dataToUpdate.password = payload.password
    }

    await this.userService.updateUser(params.id, dataToUpdate)
    session.flash('success', 'User berhasil diperbarui!')

    return response.redirect().back()
  }

  async destroy({ params, response, bouncer, session }: HttpContext) {
    if (await bouncer.denies(manageUsers)) {
      return response.unauthorized('You are not authorized')
    }

    await this.userService.deleteUser(params.id)
    session.flash('success', 'User berhasil dihapus!')

    return response.redirect().back()
  }
}

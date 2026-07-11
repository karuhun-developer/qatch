import Role from '#models/role'

export default class RoleService {
  async getAllRoles() {
    return await Role.all()
  }

  async getPaginatedRoles(page: number, limit: number) {
    return await Role.query().paginate(page, limit)
  }

  async createRole(name: string) {
    if (name) {
      await Role.create({ name })
    }
  }

  async updateRole(id: number, name: string) {
    const role = await Role.find(id)
    if (role && name && role.id !== 1 && role.id !== 2) {
      role.name = name
      await role.save()
    }
  }

  async deleteRole(id: number) {
    const role = await Role.find(id)
    if (role && role.id !== 1 && role.id !== 2) {
      await role.delete()
    }
  }
}

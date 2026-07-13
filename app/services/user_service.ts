import User from '#models/user'

export default class UserService {
  async getPaginatedUsers(page: number, limit: number) {
    return await User.query().preload('role').paginate(page, limit)
  }

  async createUser(data: any) {
    return await User.create(data)
  }

  async updateUser(id: number, data: any) {
    const user = await User.findOrFail(id)
    user.merge(data)
    await user.save()
    return user
  }

  async deleteUser(id: number) {
    const user = await User.findOrFail(id)
    if (user.id !== 1) {
      // Prevent deleting superadmin
      await user.delete()
    }
  }
}

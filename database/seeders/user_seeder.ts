import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'

export default class extends BaseSeeder {
  async run() {
    await User.firstOrCreate(
      { email: 'superadmin@superadmin.com' },
      {
        password: 'password',
        roleId: 1,
        fullName: 'Super Admin',
      }
    )
  }
}

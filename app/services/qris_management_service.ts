import Qris from '#models/qris'
import User from '#models/user'
import app from '@adonisjs/core/services/app'
import { MultipartFile } from '@adonisjs/core/bodyparser'
import string from '@adonisjs/core/helpers/string'

export default class QrisManagementService {
  async getAllForUser(userId: number, page: number, limit: number) {
    return await Qris.query().where('userId', userId).orderBy('createdAt', 'desc').paginate(page, limit)
  }

  async getByIdAndUser(id: number, userId: number) {
    return await Qris.query().where('id', id).where('userId', userId).first()
  }

  async createQris(data: { userId: number, name: string, description?: string, qrisString: string }, file: MultipartFile) {
    const user = await User.findOrFail(data.userId)
    await user.load('plan')

    if (user.plan && user.plan.maxQris !== null && user.qrisTotal >= user.plan.maxQris) {
      throw new Error(`Limit QRIS tercapai. Anda hanya dapat membuat maksimal ${user.plan.maxQris} QRIS.`)
    }

    await file.move(app.makePath('public/uploads/qris'), {
      name: `${string.random(32)}.${file.extname}`
    })

    const filePath = `uploads/qris/${file.fileName}`

    const qris = await Qris.create({
      userId: data.userId,
      name: data.name,
      description: data.description || null,
      qrisString: data.qrisString,
      qris: filePath
    })

    user.qrisTotal += 1
    await user.save()

    return qris
  }

  async updateQris(qris: Qris, data: { name?: string, description?: string, qrisString?: string }, file?: MultipartFile) {
    if (data.name) qris.name = data.name
    if (data.description !== undefined) qris.description = data.description || null
    if (data.qrisString) qris.qrisString = data.qrisString

    if (file) {
      await file.move(app.makePath('public/uploads/qris'), {
        name: `${string.random(32)}.${file.extname}`
      })
      qris.qris = `uploads/qris/${file.fileName}`
    }

    await qris.save()
    return qris
  }

  async deleteQris(qris: Qris) {
    const user = await User.findOrFail(qris.userId)
    await qris.delete()
    if (user.qrisTotal > 0) {
      user.qrisTotal -= 1
      await user.save()
    }
  }
}

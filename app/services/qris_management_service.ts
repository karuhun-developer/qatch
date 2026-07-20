import Qris from '#models/qris'
import User from '#models/user'
import UserSubscription from '#models/user_subscription'
import app from '@adonisjs/core/services/app'
import { type MultipartFile } from '@adonisjs/core/bodyparser'
import string from '@adonisjs/core/helpers/string'
import { Jimp } from 'jimp'
import jsQR from 'jsqr'
import { DateTime } from 'luxon'

export default class QrisManagementService {
  async getAllForUser(userId: number, page: number, limit: number) {
    return await Qris.query()
      .where('userId', userId)
      .orderBy('createdAt', 'desc')
      .paginate(page, limit)
  }

  async getByIdAndUser(id: number, userId: number) {
    return await Qris.query().where('id', id).where('userId', userId).first()
  }

  async createQris(
    data: { userId: number; name: string; description?: string; qrisString?: string },
    file: MultipartFile
  ) {
    const user = await User.findOrFail(data.userId)
    await user.load('plan')

    // Superadmin has no restrictions
    const isSuperadmin = user.roleId === 1

    if (!isSuperadmin) {
      // Check active subscription
      const activeSubscription = await UserSubscription.query()
        .where('userId', user.id)
        .where('status', 'active')
        .where('ends_at', '>', DateTime.now().toSQL()!)
        .first()

      if (!activeSubscription) {
        throw new Error(
          'Anda tidak memiliki paket langganan aktif. Silakan aktifkan paket terlebih dahulu.'
        )
      }

      // Check QRIS limit based on active plan
      if (user.plan && user.plan.maxQris !== null && user.qrisTotal >= user.plan.maxQris) {
        throw new Error(
          `Limit QRIS tercapai. Anda hanya dapat membuat maksimal ${user.plan.maxQris} QRIS.`
        )
      }
    }

    await file.move(app.makePath('public/uploads/qris'), {
      name: `${string.random(32)}.${file.extname}`,
    })

    const filePath = `uploads/qris/${file.fileName}`

    let qrisStr = data.qrisString
    if (!qrisStr) {
      const fullPath = app.makePath('public', filePath)
      const image = await Jimp.read(fullPath)
      // @ts-ignore
      const code = jsQR(
        new Uint8ClampedArray(image.bitmap.data),
        image.bitmap.width,
        image.bitmap.height
      )
      if (code && code.data) {
        qrisStr = code.data
      } else {
        throw new Error(
          'Gagal membaca QR Code dari gambar yang diupload. Pastikan gambar jelas dan memiliki QR Code.'
        )
      }
    }

    const qris = await Qris.create({
      userId: data.userId,
      name: data.name,
      description: data.description || null,
      qrisString: qrisStr,
      qris: filePath,
    })

    user.qrisTotal += 1
    await user.save()

    return qris
  }

  async updateQris(
    qris: Qris,
    data: { name?: string; description?: string; qrisString?: string },
    file?: MultipartFile
  ) {
    if (data.name) qris.name = data.name
    if (data.description !== undefined) qris.description = data.description || null

    let qrisStr = data.qrisString

    if (file) {
      await file.move(app.makePath('public/uploads/qris'), {
        name: `${string.random(32)}.${file.extname}`,
      })
      const filePath = `uploads/qris/${file.fileName}`
      qris.qris = filePath

      if (!qrisStr) {
        const fullPath = app.makePath('public', filePath)
        const image = await Jimp.read(fullPath)
        // @ts-ignore
        const code = jsQR(
          new Uint8ClampedArray(image.bitmap.data),
          image.bitmap.width,
          image.bitmap.height
        )
        if (code && code.data) {
          qrisStr = code.data
        } else {
          throw new Error('Gagal membaca QR Code dari gambar yang diupload.')
        }
      }
    }

    if (qrisStr) qris.qrisString = qrisStr

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

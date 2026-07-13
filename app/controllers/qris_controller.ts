import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import QrisManagementService from '#services/qris_management_service'
import { createQrisValidator, updateQrisValidator } from '#validators/qris'

@inject()
export default class QrisController {
  constructor(protected qrisManagementService: QrisManagementService) {}

  async index({ request, inertia, auth }: HttpContext) {
    const user = auth.user!
    const page = request.input('page', 1)

    const qrisData = await this.qrisManagementService.getAllForUser(user.id, page, 10)

    return inertia.render('qris/index', {
      qrisList: qrisData.serialize() as any,
    })
  }

  async store({ request, response, session, auth }: HttpContext) {
    const payload = await request.validateUsing(createQrisValidator)
    const user = auth.user!

    try {
      await this.qrisManagementService.createQris(
        {
          userId: user.id,
          name: payload.name,
          description: payload.description,
          qrisString: payload.qrisString,
        },
        payload.qris
      )

      session.flash('success', 'Data QRIS berhasil ditambahkan!')
      return response.redirect().back()
    } catch (error: any) {
      session.flash('error', error.message + ' Silakan upgrade plan Anda di menu Plan Aktif.')
      return response.redirect().back()
    }
  }

  async update({ params, request, response, session, auth }: HttpContext) {
    const payload = await request.validateUsing(updateQrisValidator)
    const user = auth.user!

    const qris = await this.qrisManagementService.getByIdAndUser(params.id, user.id)
    if (!qris) {
      return response.notFound('Data QRIS tidak ditemukan')
    }

    await this.qrisManagementService.updateQris(qris, payload, payload.qris)

    session.flash('success', 'Data QRIS berhasil diperbarui!')
    return response.redirect().back()
  }

  async destroy({ params, response, session, auth }: HttpContext) {
    const user = auth.user!

    const qris = await this.qrisManagementService.getByIdAndUser(params.id, user.id)
    if (!qris) {
      return response.notFound('Data QRIS tidak ditemukan')
    }

    await this.qrisManagementService.deleteQris(qris)

    session.flash('success', 'Data QRIS berhasil dihapus!')
    return response.redirect().back()
  }
}

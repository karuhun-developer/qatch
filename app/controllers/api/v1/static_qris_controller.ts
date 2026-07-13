import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import QrisManagementService from '#services/qris_management_service'
import { createQrisValidator, updateQrisValidator } from '#validators/qris'

@inject()
export default class StaticQrisController {
  constructor(protected qrisManagementService: QrisManagementService) {}

  async index({ request, response, auth }: HttpContext) {
    const user = auth.user!
    const page = request.input('page', 1)
    const limit = request.input('limit', 10)

    const qrisData = await this.qrisManagementService.getAllForUser(user.id, page, limit)

    return response.ok({
      message: 'Success fetch static QRIS',
      data: qrisData,
    })
  }

  async show({ params, response, auth }: HttpContext) {
    const user = auth.user!

    const qris = await this.qrisManagementService.getByIdAndUser(params.id, user.id)
    if (!qris) {
      return response.notFound({ message: 'Static QRIS not found' })
    }

    return response.ok({
      message: 'Success get static QRIS',
      data: qris,
    })
  }

  async store({ request, response, auth }: HttpContext) {
    const payload = await request.validateUsing(createQrisValidator)
    const user = auth.user!

    try {
      const qris = await this.qrisManagementService.createQris(
        {
          userId: user.id,
          name: payload.name,
          description: payload.description,
          qrisString: payload.qrisString,
        },
        payload.qris
      )

      return response.created({
        message: 'Static QRIS created successfully',
        data: qris,
      })
    } catch (error: any) {
      return response.badRequest({
        message: error.message + ' Silakan upgrade plan Anda untuk menambah limit.',
      })
    }
  }

  async update({ params, request, response, auth }: HttpContext) {
    const payload = await request.validateUsing(updateQrisValidator)
    const user = auth.user!

    const qris = await this.qrisManagementService.getByIdAndUser(params.id, user.id)
    if (!qris) {
      return response.notFound({ message: 'Static QRIS not found' })
    }

    const updatedQris = await this.qrisManagementService.updateQris(qris, payload, payload.qris)

    return response.ok({
      message: 'Static QRIS updated successfully',
      data: updatedQris,
    })
  }

  async destroy({ params, response, auth }: HttpContext) {
    const user = auth.user!

    const qris = await this.qrisManagementService.getByIdAndUser(params.id, user.id)
    if (!qris) {
      return response.notFound({ message: 'Static QRIS not found' })
    }

    await this.qrisManagementService.deleteQris(qris)

    return response.ok({
      message: 'Static QRIS deleted successfully',
    })
  }
}

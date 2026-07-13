import vine from '@vinejs/vine'

export const createQrisValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3),
    description: vine.string().trim().optional(),
    qris: vine.file({
      size: '5mb',
      extnames: ['jpg', 'png', 'jpeg', 'webp'],
    }),
    qrisString: vine.string().trim().minLength(10).optional(), // The parsed string
  })
)

export const updateQrisValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3).optional(),
    description: vine.string().trim().optional(),
    qris: vine
      .file({
        size: '5mb',
        extnames: ['jpg', 'png', 'jpeg', 'webp'],
      })
      .optional(),
    qrisString: vine.string().trim().minLength(10).optional(),
  })
)

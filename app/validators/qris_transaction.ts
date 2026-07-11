import vine from '@vinejs/vine'

export const generateDynamicQrisValidator = vine.compile(
  vine.object({
    qrisId: vine.number(),
    amount: vine.number().min(1),
    feeType: vine.enum(['none', 'fixed', 'percent']),
    feeValue: vine.number().min(0),
    expiredHours: vine.number().min(1).max(720).optional()
  })
)

export const updateDynamicQrisStatusValidator = vine.compile(
  vine.object({
    status: vine.enum(['pending', 'paid', 'expired']),
    proof: vine.file({ extnames: ['jpg', 'png', 'jpeg'], size: '5mb' }).optional()
  })
)

import vine from '@vinejs/vine'

export const createPlanValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(2).maxLength(255),
    price: vine.number().min(0),
    description: vine.string().trim().nullable().optional(),
    maxQris: vine.number().nullable().optional(),
    maxTransactionPerMonth: vine.number().nullable().optional(),
    features: vine.array(vine.string().trim()).nullable().optional(),
  })
)

export const updatePlanValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(2).maxLength(255),
    price: vine.number().min(0),
    description: vine.string().trim().nullable().optional(),
    maxQris: vine.number().nullable().optional(),
    maxTransactionPerMonth: vine.number().nullable().optional(),
    features: vine.array(vine.string().trim()).nullable().optional(),
  })
)
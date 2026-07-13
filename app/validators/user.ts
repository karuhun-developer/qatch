import vine from '@vinejs/vine'

const email = () => vine.string().email().maxLength(254)
const password = () => vine.string().minLength(8).maxLength(32)

export const signupValidator = vine.compile(
  vine.object({
    fullName: vine.string().nullable().optional(),
    email: email().unique({ table: 'users', column: 'email' }),
    password: password().confirmed({
      confirmationField: 'passwordConfirmation',
    }),
    planId: vine.number().nullable().optional(),
  })
)

export const createUserValidator = vine.compile(
  vine.object({
    fullName: vine.string().trim().optional(),
    email: email().unique({ table: 'users', column: 'email' }),
    password: password(),
    roleId: vine.number()
  })
)

export const updateUserValidator = vine.withMetaData<{ userId: number }>().compile(
  vine.object({
    fullName: vine.string().trim().optional(),
    email: email().unique({
      table: 'users',
      column: 'email',
      filter: (db, _value, field) => {
        db.whereNot('id', field.meta.userId)
      }
    }),
    password: vine.string().minLength(8).optional(),
    roleId: vine.number()
  })
)

import vine from '@vinejs/vine'

export const createRoleValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3).unique({ table: 'roles', column: 'name' }),
  })
)

export const updateRoleValidator = vine.withMetaData<{ roleId: number }>().compile(
  vine.object({
    name: vine
      .string()
      .trim()
      .minLength(3)
      .unique({
        table: 'roles',
        column: 'name',
        filter: (db, _value, field) => {
          db.whereNot('id', field.meta.roleId)
        },
      }),
  })
)

exports.up = function(knex, Promise) {
  return knex.schema.alterTable('teachinginstances', table => {
    table.integer('owner_id')
    table.foreign('owner_id').references('users.id')
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.table('teachinginstances', table => {
    table.dropColumn('owner_id')
  })
}

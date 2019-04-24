exports.up = function(knex, Promise) {
  return knex.schema.alterTable('users', table => {
    table.boolean('banned').defaultTo(false)
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.table('users', table => {
    table.dropColumn('banned')
  })
}

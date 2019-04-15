exports.up = function(knex, Promise) {
  return knex.schema.alterTable('usersteachinginstances', table => {
    table.dateTime('joindate').defaultTo(knex.fn.now())
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.table('usersteachinginstances', table => {
    table.dropColumn('joindate')
  })
}

exports.up = function(knex, Promise) {
  return knex.schema.alterTable('exercises', table => {
    table.dropColumn('firstname')
    table.dropColumn('lastname')
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.alterTable('exercises', table => {
    table
      .string('firstname')
      .notNull()
      .defaultTo('undefined')
    table
      .string('lastname')
      .notNull()
      .defaultTo('undefined')
  })
}

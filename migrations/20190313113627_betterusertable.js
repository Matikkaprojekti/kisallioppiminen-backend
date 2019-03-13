exports.up = function(knex, Promise) {
  return knex.schema.table('users', function(t) {
    t.string('lastname')
      .notNull()
      .defaultTo('undefined')
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.table('users', function(t) {
    t.dropColumn('lastname')
  })
}

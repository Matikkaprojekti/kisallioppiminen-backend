exports.up = function(knex, Promise) {
  return knex.schema.hasTable('users').then(function(exists) {
    if (!exists) {
      return knex.schema.createTable('users', function(table) {
        table.increments('id')
        table
          .string('name')
          .notNull()
          .defaultTo('undefined')
        table.string('googleid').notNull()
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
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.hasTable('users').then(exists => {
    if (exists) {
      return knex.raw('DROP TABLE users CASCADE')
    }
  })
}

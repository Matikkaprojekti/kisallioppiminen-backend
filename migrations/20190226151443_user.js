exports.up = function(knex, Promise) {
  return knex.schema.hasTable('users').then(function(exists) {
    if (!exists) {
      return knex.schema.createTable('users', function(table) {
        table.increments('id')
        table.string('name')
        table.string('googleid')
      })
    }
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.hasTable('users').then(exists => {
    if (exists) {
      knex.schema.dropTable('users')
    }
  })
}

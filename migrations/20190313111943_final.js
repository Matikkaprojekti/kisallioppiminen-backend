exports.up = function(knex, Promise) {
  return knex.schema.hasTable('asd').then(function(exists) {
    if (!exists) {
      return knex.schema.createTable('asd', function(table) {
        table.increments('id')
        table.string('name')
        table.string('googleid')
        table.string('firstname')
        table.string('lastname')
      })
    }
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.hasTable('asd').then(exists => {
    if (exists) {
      knex.schema.dropTable('asd')
    }
  })
}

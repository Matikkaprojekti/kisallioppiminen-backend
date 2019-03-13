exports.up = function(knex, Promise) {
  return knex.schema.hasTable('asd').then(function(exists) {
    if (!exists) {
      return knex.schema.table('asd', function(table) {
        table.increments('id')
        table.string('name')
        table.string('googleid')
        table.string('firstname')
        table.string('lastname')
        table.string('nwecoluasuasdu')
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

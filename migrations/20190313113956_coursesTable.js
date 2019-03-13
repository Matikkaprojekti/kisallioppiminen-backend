exports.up = function(knex, Promise) {
  return knex.schema.hasTable('courses').then(function(exists) {
    if (!exists) {
      return knex.schema.createTable('courses', function(table) {
        table.increments('id')
        table.string('courseinfo')
        table.string('coursekey')
        table.string('name').notNull()
        table.date('startdate').notNull()
        table.date('enddate').notNull()
        table.unique('coursekey')
      })
    }
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.hasTable('courses').then(exists => {
    if (exists) {
      knex.schema.dropTable('courses')
    }
  })
}

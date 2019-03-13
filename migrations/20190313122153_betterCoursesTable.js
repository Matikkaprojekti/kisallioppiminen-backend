exports.up = function(knex, Promise) {
  return knex.schema.hasTable('courses').then(function(exists) {
    if (!exists) {
      return knex.schema.createTable('courses', function(table) {
        table.increments('coursekey')
        table.string('courseinfo')
        table.string('name').notNull()
        table.date('startdate').notNull()
        table.date('enddate').notNull()
        table.primary('coursekey')
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
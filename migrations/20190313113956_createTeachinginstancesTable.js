exports.up = function(knex, Promise) {
  return knex.schema.hasTable('teachinginstances').then(function(exists) {
    if (!exists) {
      return knex.schema.createTable('teachinginstances', function(table) {
        table.string('coursekey')
        table.string('courseinfo')
        table.string('coursematerial_name')
        table.float('coursematerial_version')
        table.string('name').notNull()
        table.date('startdate').notNull()
        table.date('enddate').notNull()
        table.primary('coursekey')
      })
    }
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.hasTable('teachinginstances').then(exists => {
    if (exists) {
      return knex.raw('DROP TABLE teachinginstances CASCADE')
    }
  })
}

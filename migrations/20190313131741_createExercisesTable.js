exports.up = function(knex, Promise) {
  return knex.schema.hasTable('exercises').then(function(exists) {
    if (!exists) {
      return knex.schema.createTable('exercises', function(table) {
        table.string('uuid')
        table.string('coursekey')
        table.foreign('coursekey').references('courses.coursekey')
        table.primary('uuid')
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
  return knex.schema.hasTable('exercises').then(exists => {
    if (exists) {
      return knex.raw('DROP TABLE exercises CASCADE')
    }
  })
}

exports.up = function(knex, Promise) {
  return knex.schema.hasTable('exercises').then(function(exists) {
    if (!exists) {
      return knex.schema.createTable('exercises', function(table) {
        table.string('uuid')
        table.string('coursekey')
        table.foreign('coursekey').references('courses.coursekey')
        table.primary('uuid')
      })
    }
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.hasTable('exercises').then(exists => {
    if (exits) {
      knex.schema.dropTable('exercises')
    }
  })
}

exports.up = function(knex, Promise) {
  return knex.schema.hasTable('userscourses').then(function(exists) {
    if (!exists) {
      return knex.schema.createTable('userscourses', function(table) {
        table.integer('user_id')
        table.string('course_coursekey')
        table.foreign('user_id').references('users.id')
        table.foreign('course_coursekey').references('courses.coursekey')
        table.boolean('teacher')
        table.primary(['user_id', 'course_coursekey', 'teacher'])
      })
    }
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.hasTable('userscourses').then(exists => {
    if (exists) {
      knex.schema.dropTable('userscourses')
    }
  })
}
exports.up = function(knex, Promise) {
  return knex.schema.hasTable('usersteachinginstances').then(function(exists) {
    if (!exists) {
      return knex.schema.createTable('usersteachinginstances', function(table) {
        table.integer('user_id')
        table.string('course_coursekey')
        table.foreign('user_id').references('users.id')
        table.foreign('course_coursekey').references('teachinginstances.coursekey')
        table.boolean('teacher')
      })
    }
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.hasTable('usersteachinginstances').then(exists => {
    if (exists) {
      return knex.raw('DROP TABLE usersteachinginstances CASCADE')
    }
  })
}

exports.up = function(knex, Promise) {
  return knex.schema.hasTable('trafficlights').then(function(exists) {
    if (!exists) {
      return knex.schema.createTable('trafficlights', function(table) {
        table.string('exercise_uuid')
        table.enum('status', ['green', 'yellow', 'red'])
        table.integer('user_id')
        table.foreign('exercise_uuid').references('exercises.uuid')
        table.primary(['exercise_uuid', 'user_id'])
      })
    }
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.hasTable('trafficlights').then(exists => {
    if (exists) {
      knex.schema.droptable('trafficlights')
    }
  })
}

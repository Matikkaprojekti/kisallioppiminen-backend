exports.up = function(knex, Promise) {
  return knex.schema.hasTable('trafficlights').then(function(exists) {
    if (exists) {
      return knex.schema.table('trafficlights', function(table) {
        table.string('coursekey')
        table.foreign('coursekey').references('courses.coursekey')
        table.primary(['exercise_uuid', 'user_id', 'coursekey'])
      })
    }
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.hasTable('trafficlights').then(function(exists) {
    if (exists) {
      return knex.schema.table('trafficlights', function(table) {
        table.primary(['exercise_uuid', 'user_id'])
        table.dropColumn('coursekey')
      })
    }
  })
}

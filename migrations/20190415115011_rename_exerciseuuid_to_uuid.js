exports.up = function(knex, Promise) {
  return knex.schema.hasTable('trafficlights').then(function(exists) {
    if (exists) {
      return knex.raw('ALTER TABLE trafficlights RENAME COLUMN exercise_uuid TO uuid;')
    }
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.hasTable('trafficlights').then(function(exists) {
    if (exists) {
      return knex.raw('ALTER TABLE trafficlights RENAME COLUMN uuid TO exercise_uuid;')
    }
  })
}

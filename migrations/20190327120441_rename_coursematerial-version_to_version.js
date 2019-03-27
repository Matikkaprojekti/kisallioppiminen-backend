exports.up = function(knex, Promise) {
  return knex.schema.hasTable('teachinginstances').then(function(exists) {
    if (exists) {
      return knex.raw('ALTER TABLE teachinginstances RENAME COLUMN coursematerial_version TO version;')
    }
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.hasTable('teachinginstances').then(function(exists) {
    if (exists) {
      return knex.raw('ALTER TABLE teachinginstances RENAME COLUMN version TO coursematerial_version;')
    }
  })
}

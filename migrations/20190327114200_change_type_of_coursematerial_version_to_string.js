exports.up = function(knex, Promise) {
  return knex.schema.alterTable('teachinginstances', table => {
    table.string('coursematerial_version').alter()
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.alterTable('teachinginstances', table => {
    table.float('coursematerial_version').alter()
  })
}

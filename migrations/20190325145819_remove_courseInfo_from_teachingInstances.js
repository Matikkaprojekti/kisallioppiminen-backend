exports.up = function(knex, Promise) {
  return knex.schema.alterTable('teachinginstances', table => {
    table.dropColumn('courseinfo')
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.table('teachinginstances', table => {
    table.string('courseinfo').defaultTo('No courseinfo specified')
  })
}

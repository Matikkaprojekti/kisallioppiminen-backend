exports.up = function(knex, Promise) {
  return knex.schema.alterTable('usersteachinginstances', table => {
    table.primary(['user_id', 'course_coursekey'])
  })
}

exports.down = function(knex, Promise) {
  return knex.raw('alter table usersteachinginstances drop constraint usersteachinginstances_pkey;')
}

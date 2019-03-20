exports.up = function(knex, Promise) {
  return knex.schema.alterTable('usersteachinginstances', table => {
    table.primary(['user_id', 'course_coursekey', 'teacher'])
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.table(table => {
    knex.raw('alter table usersteachinginstances drop constraint usersteachinginstances_pkey;')
  })
}

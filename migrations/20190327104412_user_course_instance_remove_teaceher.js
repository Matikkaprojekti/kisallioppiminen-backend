
exports.up = function(knex, Promise) {
  return knex.schema.hasTable('usersteachinginstances').then(function(exists) {
    if (exists) {
      return knex.raw('alter table usersteachinginstances drop column teacher;')
    }
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.table('usersteachinginstances', table => {
    table.boolean('teacher')
  })
};

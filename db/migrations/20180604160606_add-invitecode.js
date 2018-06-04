exports.up = function (knex, Promise) {
  return Promise.all([
    knex.schema.table('team', function (table) {
      table.string('invite_code');
    })
  ])
};

exports.down = function (knex, Promise) {
  return Promise.all([
    knex.schema.table('team', function (table) {
      table.dropColumn('invite_code');
    })
  ])
};
exports.up = function (knex, Promise) {
  return Promise.all([
    knex.schema.table('team', function (table) {
      table.string('start_date');
    })
  ])
};

exports.down = function (knex, Promise) {
  return Promise.all([
    knex.schema.table('team', function (table) {
      //table.dropColumn('start_date');
    })
  ])
};

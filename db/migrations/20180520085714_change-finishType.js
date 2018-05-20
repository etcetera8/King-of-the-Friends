
exports.up = function(knex, Promise) {
  knex.schema.table('team', function (table) {
    table.dropColumn('finish_date');
    table.string('finish_date');
  })
};

exports.down = function(knex, Promise) {
  knex.schema.table('team', function (table) {
    table.dropColumn('finish_date');
    table.dateTime('finish_date')
  })
};

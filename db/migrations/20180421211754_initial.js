
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('users', table => {
      table.increments('id').primary();
      table.string('name');
      table.string('email');
      table.boolean('team_lead');
      table.integer('team_id');
      table.foreign('team_id').references('team.id');
    }),
    knex.schema.createTable('team', table => {
      table.increments('id').primary();
      table.string('name');
      table.string('segment_id');
      table.dateTime('finish_date');
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('users'),
    knex.schema.dropTable('team')
  ]);
};

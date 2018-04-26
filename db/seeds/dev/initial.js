
exports.seed = function(knex, Promise) {
  return knex('users').del()
  .then(() => knex('team').del())
  .then(() => {
    return knex('users').insert({
      name: 'parker',
      email: 'fugazi8@gmail.com',
    })
  })
  .then(() => {
    return knex('team').insert({
      name: "colavita",
      segment_id: '8576849',
    })
  })
  .catch( error => {
    console.log(`error seeding data: ${error}`)
  })
};

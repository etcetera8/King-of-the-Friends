
exports.seed = function(knex, Promise) {
  return knex('users').del()
  .then(() => knex('team').del())
  .then(() => {
    return knex('users').insert({
      name: 'parker',
      email: 'fugazi8@gmail.com',
      team_lead: true,
      segment_time: 1521,
      picture: 'https://dgalywyr863hv.cloudfront.net/pictures/athletes/9560317/2891494/1/medium.jpg'
    })
  })
  .then(() => {
    return knex('users').insert({
      name: 'eric ernst',
      email: 'ernie@gmail.com',
      team_lead: false,
      segment_time: 1421,
      picture: 'https://dgalywyr863hv.cloudfront.net/pictures/athletes/29455766/8856154/9/large.jpg'
    })
  })
  .then(() => {
    return knex('users').insert({
      name: 'Matty O',
      email: 'matty@gmail.com',
      team_lead: false,
      segment_time: 1221,
      picture: 'https://scontent.xx.fbcdn.net/v/t1.0-1/c22.22.276.276/p320x320/405890_912876337009_1952044410_n.jpg?_nc_cat=0&oh=62ece6c640cf4cc13c100212ee29482c&oe=5B79202C'
    })
  })
  .then(() => {
    return knex('team').insert({
      name: "Colavita",
      segment_id: '609371',
      finish_date: '2018-05-29 23:30:00-06',
      start_date: '2018-03-01'
    })
  })
  .then(() => {
    return knex('team').insert({
      name: "Primal Audi",
      segment_id: '809371',
      finish_date: '2018-05-30 23:30:00-06',
      start_date: '2018-03-03'
    })
  })
  .catch( error => {
    console.log(`error seeding data: ${error}`)
  })
};

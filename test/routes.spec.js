const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');

const environment = process.env.NODE_ENV || 'test';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

chai.use(chaiHttp);

describe('API routes', () => {
  beforeEach((done) => {
    database.migrate.rollback()
      .then(() => {
        database.migrate.latest()
          .then(() => {
            return database.seed.run()
              .then(() => {
                done();
              })
          })
      })
  })

  describe('GET /api/v1/users', () => {
    it('should return all of the users', () => {
      return chai.request(server)
      .get('/api/v1/users')
      .then( response => {
        response.should.have.status(200)
        response.should.be.json;
        response.body.should.be.a('array')
        response.body[0].should.have.all.keys(['name', 'email', 'id', 'team_id', 'team_lead', 'picture', 'segment_time', 'token'])
        response.body[0].id.should.equal(1);
        response.body[0].name.should.equal('parker');
        response.body[0].email.should.equal('fugazi8@gmail.com');
      })
    })
  })

  describe('POST /api/v1/users', () => {
    it('should post a new user to the db', () => {
      return chai.request(server)
      .post('/api/v1/users')
      .send({
        name: 'Daniel Lindley',
        email: 'dan@gmail.com'
      })
      .then(response => {
        response.should.have.status(201)
        response.body[0].should.equal(4)
      })
    })
  })

  describe('GET /api/v1/users/:email', () => {
    it('should return the user associated with the email address passed in as a param', () => {
      return chai.request(server)
      .get('/api/v1/users/fugazi8@gmail.com')
      .then( response => {
        response.status.should.equal(200)
        response.body[0].should.have.all.keys(['name', 'email', 'id', 'team_id', 'team_lead', 'picture', 'segment_time', 'token'])
        response.body[0].name.should.equal('parker')
        response.body[0].email.should.equal('fugazi8@gmail.com')
        response.body[0].team_lead.should.equal(true)
        response.body[0].picture.should.equal('https://dgalywyr863hv.cloudfront.net/pictures/athletes/9560317/2891494/1/medium.jpg')
        response.body[0].segment_time.should.equal(1521);
      })
    })
  })

  describe('GET /api/v1/team', () => {
    it('should return all of the teams', () => {
      return chai.request(server)
      .get('/api/v1/team')
      .then( response => {
        response.status.should.equal(200)
        response.body.length.should.equal(2)
      })
    })
  })

  describe('GET /api/v1/team/:id', () => {
    it('should return a team with a specific id', () => {
      return chai.request(server)
      .get('/api/v1/team/1')
      .then( response => {
        response.status.should.equal(200)
        response.body.length.should.equal(1)
        response.body[0].should.have.all.keys(['name', 'id', 'finish_date', 'start_date', 'segment_id'])
      })
    })
  })

  describe('POST /api/v1/team', () => {
    it('should post a new team to the backend', () => {
      return chai.request(server)
      .post('/api/v1/team')
      .send({
        name: 'Team Sky',
        finish_date: '2018-11-01',
        start_date: '2018-03-01',
        segment_id: 111111
      })
      .then(response => {
        response.status.should.equal(201)
        response.body.should.have.key('id')
        response.body.id.should.equal(3)
      })
    })
  })

  describe('PATCH /api/v1/users/:email', () => {
    it('should update a user with the object keys passed in', () => {
      return chai.request(server)
      .patch('/api/v1/users/fugazi8@gmail.com')
      .send({
        segment_time: 1000
      })
      .then(response => {
        response.status.should.equal(201)
        response.body.id.should.equal(1)
        response.body.email.should.equal('fugazi8@gmail.com')
        response.body.request.segment_time.should.equal(1000)
      })
    })
  })

  describe('PATCH /api/v1/team/:id', () => {
    it('should update a team with the object keys passed in', () => {
      return chai.request(server)
      .patch('/api/v1/team/1')
      .send({
        segment_id: 1111
      })
      .then(response => {
        response.status.should.equal(201)
        response.body.id.should.equal('1')
        response.body.request.segment_id.should.equal(1111)
      })
    })
  })

})


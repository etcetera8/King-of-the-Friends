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

})


const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');
const environment = process.env.NODE_ENV || 'test';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

chai.use(chaiHttp);

describe('API routes', () => {

  describe('GET /api/v1/users', () => {
    it('should return all of the users', () => {
      return chai.request(server)
      .get('/api/v1/users')
      .then( response => {
        response.should.have.status(200)
        response.should.be.json;
        response.body.should.be.a('array')
        response.body[0].should.have.all.keys(['name', 'email', 'id', 'team_id', 'team_lead']);
        response.body[0].id.should.equal(1);
        response.body[0].name.should.equal('parker');
        response.body[0].email.should.equal('fugazi8@gmail.com');
      })
    })
  })


})


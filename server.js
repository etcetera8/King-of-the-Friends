const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.set('port', process.env.PORT || 8001);

app.locals.title = "kom db";
app.use(bodyParser.json());

app.get('/api/v1/users', (request, response) => {
  database('users').select()
    .then( users => {
      response.status(200).json(users);
    })
    .catch( error => {
      response.status(500).json({ error });
    })
})
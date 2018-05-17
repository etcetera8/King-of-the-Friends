const express = require('express');
const app = express();
const bodyParser = require('body-parser');
var polyline = require('@mapbox/polyline');
var fetch = require("node-fetch");
const axios = require('axios');

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);
const key = require('./apikey.js')
app.set('port', process.env.PORT || 8001);

app.locals.title = "kom db";
app.use(bodyParser.json());

app.post('/api/v1/route', async (request, response) => {
  let { startLocation, destination } = request.body
  axios.get(`https://maps.googleapis.com/maps/api/directions/json?origin=${startLocation.latitude},${startLocation.longitude}&destination=${destination.latitude},${destination.longitude}&mode=walking&key=${key}`)
    .then(result => result.data)
    .then(result => {
      let array = polyline.decode(result.routes[0].overview_polyline.points);
      let coordinates = array.map((point) => {
        return {
          latitude: point[0],
          longitude: point[1]
        }
      })
      response.send(coordinates)
    }).catch(error => console.log(error.message)) 
})

app.get('/api/v1/users', (request, response) => {
  database('users').select()
  .then( users => {
    response.status(200).json(users);
  })
  .catch( error => {
    response.status(500).json({ error });
  })
})

app.post('/api/v1/users', (request, response) => {
  const { name, email } = request.body;
  const user = { name, email };
  database('users').insert(user, 'id')
  .then(user => {
    response.status(201).json(user)
  })
  .catch(error => {
    response.status(500).json({error})
  })
})

app.get('/api/v1/users/:id', (request, response) => {
  const { id } = request.params;
  database('users').where('id', id)
  .then(user => {
    response.status(200).json(user);
  })
  .catch(error => {
    response.status(500).json({ error });
  })
})

app.get('/api/v1/teamid', (request, response) => {
  const {teamid} = request.query
  console.log(teamid)
  database('users').where('team_id', teamid)
    .then( users => {
      response.status(200).json(users);
    })
    .catch(error => {
      response.status(500).json({ error });
    })
})


app.patch('/api/v1/users/:id', (request, response) => {
  const { id } = request.params;
  const teamId = request.body;
  database('users').where('id', id).update(teamId)
    .then(user => {
      if (user) {
        response.status(200).json(user)
      } else {
        response.status(404).json({'error': `no user with id: ${id} exists`})
      }
    })
    .catch( error => {
      response.status(500).json({error})
    })

})

app.get('/api/v1/team', (request, response) => {
  database('team').select()
    .then( team => {
      response.status(200).json(team);
    })
    .catch( error => {
      response.status(500).json({ error });
    })
})

app.get('/api/v1/team/:id', (request, response) => {
  const { id } = request.params;
  database('team').where('id', id)
    .then( team => {
      response.status(200).json(team)
    })
    .catch( error => {
      response.status(500).json({ error })
    })
})

app.post('/api/v1/team', (request, response) => {
  const { name, segment_id, finish_date } = request.body;
  let team = { name, segment_id, finish_date };
  database('team').insert(team, 'id')
    .then(team => {
      response.status(201).json({id: team[0]})
    })
    .catch( error => {
      response.status(500).json({error})
    })
})

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is listening at ${app.get('port')}`);
});

module.exports = app;
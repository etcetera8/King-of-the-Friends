const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const polyline = require('@mapbox/polyline');
const axios = require('axios');
const key = require('./apikey.js')
const tokenExchange = require('./routes/tokenExchange')
const home = require('./routes/index')
const proxy = require('express-http-proxy')
const cors = require('cors')

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);
app.set('port', process.env.PORT || 8001);

const stravaClientId = process.env.stravaClientId || key.clientId
const stravaClientSecret = process.env.stravaClientSecret || key.clientSecret

app.locals.title = "kom db";
app.use(bodyParser.json());
app.use(cors())

app.use('/', home(stravaClientId))
app.use('/tokenexchange', tokenExchange(stravaClientId, stravaClientSecret))

app.use('/strava', proxy('www.strava.com', {
  decorateRequest: function (proxyReq, originalReq) {
    for (const headerName in originalReq.headers) {
      // exclude the host header to prevent certificate chain issues
      if (headerName.toLowerCase() !== 'host') {
        proxyReq.headers[headerName] = originalReq.headers[headerName]
      }
    }
  },
  filter: function (req) {
    // don't pass on cors handshaking
    return req.method !== 'OPTIONS'
  },
  https: true
}))

app.post('/api/v1/route', async (request, response) => {
  let { startLocation, destination } = request.body
  axios.get(`https://maps.googleapis.com/maps/api/directions/json?origin=${startLocation.latitude},${startLocation.longitude}&destination=${destination.latitude},${destination.longitude}&mode=walking&key=${key.gkey}`)
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

app.get('/api/v1/users/:email', (request, response) => {
  const { email } = request.params;
  database('users').where('email', email)
  .then( user => {
    response.status(200).json(user);
  })
  .catch(error => {
    response.status(500).json({ error });
  })
})

app.get('/api/v1/teamid', (request, response) => {
  const { teamid } = request.query
  database('users').where('team_id', teamid)
    .then( users => {
      response.status(200).json(users);
    })
    .catch(error => {
      response.status(500).json({ error });
    })
})

app.patch('/api/v1/users/:email', (request, response) => {
  const { email } = request.params;
  const teamId = request.body;
  database('users').where('email', email).update(teamId)
    .then(user => {
      if (user) {
        response.status(201).json(user)
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
  const { name, segment_id, finish_date, start_date } = request.body;
  let team = { name, segment_id, finish_date, start_date };
  database('team').insert(team, 'id')
    .then(team => {
      response.status(201).json({id: team[0]})
    })
    .catch( error => {
      response.status(500).json({error})
    })
})

app.patch('/api/v1/team/:id', (request, response) => {
  const { id } = request.params;
  const team = request.body;
  database('team').where('id', id).update(team)
    .then(team => {
      response.status(201).json({team})
    })
    .catch( error => {
      response.status(500).json({error})
    })
})

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is listening at ${app.get('port')}`);
});

module.exports = app;
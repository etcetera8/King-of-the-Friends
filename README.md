[![Build Status](https://travis-ci.org/etcetera8/King-of-the-Friends.svg?branch=master)](https://travis-ci.org/etcetera8/King-of-the-Friends)

# King of the Friends

An application for active cyclist friends to compete against eachother and deem who is the King of the Friends.

Upon signing and signing up users can join or create a team, upon joining a team, a team leader sets a Strava segment as essentially the 'race-course' and a start and finish date. All users can 'race' the segment on their own time as many times as they want within the race timeframe. At the end of 'race' whichever friend has the fastest time is deemed 'King of the Friends' and they are then able to choose the next segment and and start and finish date. Everyone who lost should pitch in to buy a beer for the newly crowned King. 


## Get it Started

Be sure to have these dependencies installed.
- postgreSQL
- xCode 9.3 or higher
- Expo on your phone




first clone down the repo then cd into and run ```npm i```

```CREATE``` a pg datbase named kom
run ```knex migrate:latest``` to set up the schema
run ```knex seed:run``` to populate with the dummy data
start with ```npm start``` then ```i``` to start ios simulator (Must have xcode 9.3.0 or later)
start backend with ```node server.js```
run debugger with this ```open "rndebugger://set-debugger-loc?host=localhost&port=19001"```
run front end tests with ```jest```
run back end tests with ```npm t```



This project was bootstrapped with [Create React Native App](https://github.com/react-community/create-react-native-app).

module.exports = {
  development: {
    client: 'pg',
    migrations: {
      directory: './db/migrations'
    },
    useNullAsDefault: true
  }
};

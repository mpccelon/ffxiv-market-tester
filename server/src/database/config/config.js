module.exports = {
  "development": {
    "username": process.env.POSTGRES_USER,
    "password": process.env.POSTGRES_PASSWORD,
    "database": process.env.POSTGRES_DB,
    "host": "127.0.0.1",
    "port": process.env.POSTGRES_PORT,
    "dialect": "postgresql"
  },
  "test": {
    "username": process.env.POSTGRES_USER,
    "password": process.env.POSTGRES_PASSWORD,
    "database": process.env.POSTGRES_DB,
    "host": "127.0.0.1",
    "port": process.env.POSTGRES_PORT,
    "dialect": "postgresql"
  },
  "production": {
    "username": process.env.POSTGRES_USER,
    "password": process.env.POSTGRES_PASSWORD,
    "database": process.env.POSTGRES_DB,
    "host": "127.0.0.1",
    "port": process.env.POSTGRES_PORT,
    "dialect": "postgresql"
  }
}

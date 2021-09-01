"use strict"

// ref: https://devhints.io/knex
// TODO: implement more dynamic env var settings loader
const keys = require("./keys")
module.exports = {
  development: {
    client: "pg",
    connection: {
      user: keys.USERNAME,
      password: keys.PASSWORD,
      database: keys.DB,
      host: keys.INSTANCE_CONNECTION_NAME_DEV,
    },
    pool: {
      min: 2,
      max: 10,
      createTimeoutMillis: 3000,
      acquireTimeoutMillis: 30000,
      idleTimeoutMillis: 30000,
      reapIntervalMillis: 1000,
      createRetryIntervalMillis: 100,
      propagateCreateError: false,
    },
  },
  staging: {
    client: "pg",
    connection: {
      user: keys.USERNAME,
      password: keys.PASSWORD,
      database: keys.DB,
      host: `/cloudsql/${keys.INSTANCE_CONNECTION_NAME_PROD}`,
    },
    pool: {
      min: 2,
      max: 10,
    },
  },
  production: {
    client: "pg",
    connection: {
      user: keys.USERNAME,
      password: keys.PASSWORD,
      database: keys.DB,
      host: `/cloudsql/${keys.INSTANCE_CONNECTION_NAME_PROD}`,
    },
    pool: {
      min: 2,
      max: 10,
    },
  },
}

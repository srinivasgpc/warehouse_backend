// "use strict"

const env = process.env.NODE_ENV || "development"
// const knexfile = require("../knexfile")
// console.log(knexfile[env])
// const knex = require("knex")(knexfile[env])

// module.exports = knex

const Knex = require("knex")
const knexfile = require("../knexfile")

const connect = () => {
  const knex = Knex(knexfile[env])

  return knex
}

const knex = connect()

module.exports = knex

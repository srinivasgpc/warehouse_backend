"use strict"

const createGuts = require("../helpers/model-guts")

const name = "Products"
const tableName = "products"

const selectableProps = ["name", "art_id", "amount_of"]

module.exports = (knex) => {
  const guts = createGuts({
    knex,
    name,
    tableName,
    selectableProps,
  })

  return {
    ...guts,
  }
}

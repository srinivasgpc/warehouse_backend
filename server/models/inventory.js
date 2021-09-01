"use strict"

const createGuts = require("../helpers/model-guts")

const name = "Inventory"
const tableName = "inventory"

const selectableProps = ["id", "stock", "name"]

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

"use strict"

const { groupBy } = require("../helpers/common")
const knex = require("../../config/database")

const getAllProducts = async (req, res, next) => {
  try {
    await knex.transaction(async (trx) => {
      const products = await getProducts(trx)
      const inventory = await trx.raw(`Select id as art_id , stock_updated as stock ,name from inventory`)
      const newProducts = getProductsWithQuantity(products.rows, inventory.rows)

      res.json({
        ok: true,
        results: {
          products: newProducts,
          inventory: inventory.rows,
        },
      })
    })
  } catch (e) {
    next(e)
  }
}
const sellProduct = async (req, res, next) => {
  try {
    const { product } = req.body
    if (product) {
      await knex.transaction(async (trx) => {
        const stock_updated = await trx("inventory").select("id", "stock_updated", "name")
        const getStockWithProduct = product.map((x) => {
          const stockValue = stock_updated.find((y) => y.id === x.art_id)
          if (stockValue) {
            return { id: x.art_id, stock_updated: stockValue.stock_updated - x.amount_of, name: stockValue.name }
          }
        })
        const updatedStock = await updateAllStock(getStockWithProduct)
        let formatUpdatedStock = updatedStock.flat()
        let updatedInventory = stock_updated.map((z) => {
          const remainingStock = formatUpdatedStock.find((u) => u.id === z.id)
          if (remainingStock) {
            return { ...z, stock_updated: remainingStock.stock_updated }
          } else {
            return z
          }
        })

        updatedInventory = updatedInventory.map((x) => {
          return { art_id: x.id, stock: x.stock_updated, name: x.name }
        })
        const products = await getProducts(trx)
        const newProducts = getProductsWithQuantity(products.rows, updatedInventory)
        res.json({
          ok: true,
          results: {
            products: newProducts,
            inventory: updatedInventory,
          },
        })
      })
    } else {
      next(new Error("No Product recieved"))
    }
  } catch (e) {
    next(e)
  }
}

const updateAllStock = (inventory) => {
  return knex.transaction((trx) => {
    const queries = []
    inventory.forEach((stock) => {
      const query = knex("inventory")
        .where("id", stock.id)
        .update({
          stock_updated: stock.stock_updated,
        })
        .returning("*")
        .transacting(trx) // This makes every update be in the same transaction
      queries.push(query)
    })

    Promise.all(queries) // Once every query is written
      .then(trx.commit) // We try to execute all of them
      .catch(trx.rollback) // And rollback in case any of them goes wrong
  })
}

const getProducts = async (trx) => {
  return await trx.raw(`Select * from products`)
}
const getProductsWithQuantity = (products, inventory) => {
  const productsFormatted = groupBy(products, "name")
  const newProducts = Object.keys(productsFormatted).map((element) => {
    let qunatityLeast = []
    const contain_articles = productsFormatted[element].map((x) => {
      const getInventory = inventory.find((y) => y.art_id === x.art_id)
      const getQuantity = Math.floor(getInventory.stock / x.amount_of)
      qunatityLeast.push(getQuantity)
      return { art_id: x.art_id, amount_of: x.amount_of }
    })
    var smallest = qunatityLeast.sort((a, b) => a - b)

    return {
      name: element,
      quantity_available: smallest[0],
      contain_articles: contain_articles,
    }
  })
  return newProducts
}

const resetStock = async (req, res, next) => {
  try {
    const inventoryDefault = [
      { id: 1, stock_updated: 12 },
      { id: 2, stock_updated: 17 },
      { id: 3, stock_updated: 2 },
      { id: 4, stock_updated: 1 },
    ]
    const resetResponse = await updateAllStock(inventoryDefault)

    res.json({
      ok: true,
      message: "Stock reset to default",
      results: resetResponse,
    })
  } catch (e) {
    next(e)
  }
}
module.exports = {
  getAllProducts,
  sellProduct,
  resetStock,
}

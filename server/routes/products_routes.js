"use strict"

const router = require("express").Router()
const { getAllProducts, sellProduct, resetStock } = require("../controllers/products_controller")

router.route("/products").get(getAllProducts).post(sellProduct)
router.route("/products/resetStock").get(resetStock)

module.exports = router

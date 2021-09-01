"use strict"

const express = require("express")
const bodyParser = require("body-parser")

const app = express()
app.enable("trust proxy")

app.use(require("cors")())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use("/", [require("./routes/products_routes")])

app.use(require("./middleware/error_middleware").all)

module.exports = app

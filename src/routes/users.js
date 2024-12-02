const express = require('express')
const route = express.Router()
const rest = require('../controllers/restController')

// get routes
route.get('/', rest.index)

// post
route.post("/login", rest.login)
route.post("/signup", rest.signup)

module.exports = route
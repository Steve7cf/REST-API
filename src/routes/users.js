const express = require('express')
const route = express.Router()
const rest = require('../controllers/restController')

// get routes
route.get('/', rest.index)
route.get("/home", rest.home)
route.get("/login", rest.login)
route.get("/signup", rest.signup)
route.get("/logout", rest.logout)

// post
route.post("/auth", rest.auth)
route.post("/create", rest.create)


module.exports = route
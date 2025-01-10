const express = require('express')
const { login, register, logout } = require('./admin.controller')
const adminRouter = express.Router()

adminRouter
  .post('/register', register)
  .post('/login', login)
  .post('/logout', logout)

module.exports = adminRouter

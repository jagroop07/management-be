const express = require('express')
const {
  registerLeave,
  fetchLeaves,
  fetchLeave,
  updateLeave,
  deleteLeave
} = require('./leave.controller')
const leaveRouter = express.Router()

leaveRouter
  .post('/register', registerLeave)
  .post('/', fetchLeaves)
  .get('/:id', fetchLeave)
  .patch('/update/:id', updateLeave)
  .delete('/delete/:id', deleteLeave)

module.exports = leaveRouter

const express = require('express')
const {
  fetchEmployees,
  fetchEmployee,
  updateEmployee,
  deleteEmployee
} = require('./employee.controller')
const employeeRouter = express.Router()

employeeRouter
  .post('/', fetchEmployees)
  .get('/:id', fetchEmployee)
  .patch('/update/:id', updateEmployee)
  .delete('/delete/:id', deleteEmployee)

module.exports = employeeRouter

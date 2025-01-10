const express = require('express')
const {
  fetchAttendances,
  fetchAttendance,
  updateAttendance,
  deleteAttendance
} = require('./attendance.controller')
const attendanceRouter = express.Router()

attendanceRouter
  .post('/', fetchAttendances)
  .get('/:id', fetchAttendance)
  .patch('/update/:id', updateAttendance)
  .delete('/delete/:id', deleteAttendance)

module.exports = attendanceRouter

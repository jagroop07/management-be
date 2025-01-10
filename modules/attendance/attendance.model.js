const mongoose = require('mongoose')

const attendanceSchema = new mongoose.Schema({
  empId: { type: mongoose.Schema.Types.ObjectId, ref: 'employee' },
  task: String,
  status: {
    type: String,
    enum: ['Present', 'Absent', 'Medical Leave', 'Work from Home']
  }
})

module.exports = mongoose.model('attendance', attendanceSchema)

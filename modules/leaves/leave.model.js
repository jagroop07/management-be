const mongoose = require('mongoose')

const leaveSchema = new mongoose.Schema({
  empId: { type: mongoose.Schema.Types.ObjectId, ref: 'employee' },
  leave_date: Date, //only one day as multiple day leave isnt an option according to figma
  attachment: String,
  reason: String,
  status: String
})

module.exports = mongoose.model('leave', leaveSchema)

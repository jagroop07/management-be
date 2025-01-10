const mongoose = require('mongoose')

const employeeSchema = new mongoose.Schema({
  profile: String,
  name: String,
  email: { type: String, unique: true },
  phone_number: Number,
  position: {
    type: String,
    enum: ['Intern', 'Full Time', 'Junior', 'Senior', 'Team Lead']
  },
  department: { type: String, default: 'Development' },
  joining_date: { type: Date }
})

module.exports = mongoose.model('employee', employeeSchema)

const mongoose = require('mongoose')
const { getNxtSrNmbr } = require('../../utils/constants')

const candidateSchema = new mongoose.Schema({
  sr_number: { type: Number, unique: true },
  name: String,
  email: { type: String, unique: true },
  phone_number: Number,
  position: {
    type: String,
    enum: ['Intern', 'Full Time', 'Junior', 'Senior', 'Team Lead']
  },
  status: {
    type: String,
    enum: ['Scheduled', 'Ongoing', 'Selected', 'Rejected'],
    default: "Scheduled"
  },
  experience: String,
  resume: String
})

// middleware to set serial number auto
candidateSchema.pre('save', async function (next) {
  if (this.isNew) {
    this.sr_number = await getNxtSrNmbr(this.constructor, 'sr_number')
  }
  next()
})

module.exports = mongoose.model('candidate', candidateSchema)

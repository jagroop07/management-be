const mongoose = require('mongoose')
const { getNxtSrNmbr } = require('../../utils/constants')

const candidateSchema = new mongoose.Schema({
  sr_number: { type: Number, unique: true },
  name: String,
  email: String,
  phone_number: Number,
  position: String,
  status: {
    type: String,
    enum: ['Scheduled', 'Ongoing', 'Selected', 'Rejected']
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

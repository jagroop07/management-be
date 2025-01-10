const mongoose = require('mongoose')

const DBConnect = async () => {
  try {
    await mongoose.connect(process.env.DB_URL)
    console.log('database connected successfully')
  } catch (error) {
    console.log(error.message)
  }
}

module.exports = DBConnect

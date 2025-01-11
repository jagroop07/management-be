const jwt = require('jsonwebtoken')

const FRONTEND_URL = 'https://management-six-psi.vercel.app'

//token generator
const assignToken = async id => {
  const token = jwt.sign(id, process.env.SECRET_KEY, {
    expiresIn: '2h'
  })

  return token
}

//serial number generator
const getNxtSrNmbr = async (model, field) => {
  const latestRecord = await model.findOne().sort({ [field]: -1 })
  return latestRecord ? latestRecord[field] + 1 : 1
}

//query builder
const buildQuery = (filter = {}, search = '', searchFields = [], date = '') => {
  let query = { ...filter }

  if (search) {
    query.$or = searchFields.map(field => ({
      [field]: { $regex: search, $options: 'i' }
    }))
  }

  return query
}

module.exports = {
  assignToken,
  FRONTEND_URL,
  getNxtSrNmbr,
  buildQuery
}

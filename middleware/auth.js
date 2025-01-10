const jwt = require('jsonwebtoken')

const auth = async (req, res, next) => {
  try {
    const token = req.cookies['admin-token']

    if (!token) {
      return res
        .status(401)
        .json({ message: 'token not found', authenticate: false })
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY)
    req.admin = decoded

    next()
  } catch (error) {
    return res
      .status(403)
      .json({ message: 'authorization failed', authenticate: false })
  }
}

module.exports = auth

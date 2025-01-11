const bcrypt = require('bcrypt')
const adminModel = require('./admin.model')
const { assignToken } = require('../../utils/constants')

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body
    if (!name || !email || !password) {
      return res.json({ message: 'All fields are required' })
    } else {
      const securepass = await bcrypt.hash(password, 10)
      const isPresent = await adminModel.findOne({ email: email })

      if (isPresent) {
        throw 'user is already exists'
      }

      await adminModel.create({
        name,
        email,
        password: securepass
      })

      return res.json({
        message: 'admin registered',
        status: 201,
        success: true
      })
    }
  } catch (error) {
    res.json({ message: error || 'something went error', success: false })
  }
}

const login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      throw 'fields are missing'
    }

    const admin = await adminModel.findOne({ email })

    if (!admin) {
      return res.json({
        message: 'invalid credentials',
        status: 404,
        success: false
      })
    }
    const cmpass = bcrypt.compareSync(password, admin?.password)
    if (!cmpass) {
      return res.json({ message: 'incorrect password', success: false })
    }

    const token = await assignToken({ id: admin._id })

    return res
      .cookie('admin-token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
        maxAge: 60 * 60 * 2 * 1000
      })
      .json({
        message: 'login successfully',
        success: true
      })
  } catch (error) {
    res.json({
      message: error.message || 'something went wrong',
      status: 400,
      success: false
    })
  }
}

const logout = async (req, res) => {
  try {
    res.clearCookie('admin-token', {
      httpOnly: true,
      secure: true,
      sameSite: 'None'
    })

    res.status(200).json({ message: 'logged out', success: true })
  } catch (error) {
    return res.status(400).json({
      message: error.message || 'something went wrong',
      success: false
    })
  }
}

module.exports = {
  register,
  login,
  logout
}

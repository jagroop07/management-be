const { buildQuery } = require('../../utils/constants')
const employeeModel = require('./employee.model')
const attendanceModel = require('../attendance/attendance.model')

//list all the employees with searching and filtering
const fetchEmployees = async (req, res) => {
  try {
    const { search, filter } = req.body

    const searchFields = ['name', 'email', 'position', 'department']

    let query = buildQuery(filter, search, searchFields)

    const employees = await employeeModel.find(query)

    return res.json({
      message: 'employees listed successfully',
      success: true,
      details: employees
    })
  } catch (error) {
    return res.json({
      message: error || 'something went wrong',
      success: false
    })
  }
}

const fetchEmployee = async (req, res) => {
  try {
    const { id } = req.params

    const employee = await employeeModel.findOne({ _id: id })

    return res.json({
      message: 'successfully fetched',
      success: true,
      details: employee
    })
  } catch (error) {
    console.log(error.message)
    return res.json({
      message: error || 'something went wrong',
      success: false
    })
  }
}

const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params
    const data = req.body

    if (!id) {
      return res.json({ message: 'not found', success: false })
    }

    //only if the profile pic is present
    const updateData = req.file ? { ...data, profile: req.file.path } : data

    const updatedEmployee = await employeeModel.findOneAndUpdate(
      { _id: id },
      updateData,
      { new: true }
    )

    return res.json({
      message: 'updated successfully',
      success: true,
      details: updatedEmployee
    })
  } catch (error) {
    return res.json({
      message: error || 'something went wrong',
      success: false
    })
  }
}

const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params

    const employee = await employeeModel.findOneAndDelete({ _id: id })

    await attendanceModel.findOneAndDelete({ empId: id })

    return res.json({
      message: 'deleted employee successfully',
      success: true,
      details: employee
    })
  } catch (error) {
    return res.json({
      message: error || 'something went wrong',
      success: false
    })
  }
}

module.exports = {
  fetchEmployees,
  fetchEmployee,
  updateEmployee,
  deleteEmployee
}

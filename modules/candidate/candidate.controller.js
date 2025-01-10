const { buildQuery } = require('../../utils/constants')
const candidateModel = require('./candidate.model')
const employeeModel = require('../employees/employee.model')
const attendanceModel = require('../attendance/attendance.model')

const registerCandidate = async (req, res) => {
  try {
    const data = req.body

    if (!req.file) {
      return res.json({ message: 'resume is needed', success: false })
    }

    const new_candidate = await candidateModel.create({
      ...data,
      resume: req.file.path
    })

    return res.json({
      message: 'candidate registered',
      success: true,
      details: new_candidate
    })
  } catch (error) {
    return res.json({
      message: error || 'something went wrong',
      success: false
    })
  }
}

//fetch all candidate list with searching and filtering
const fetchCandidates = async (req, res) => {
  try {
    const { filter, search } = req.body

    const searchFields = ['name', 'email', 'position']

    const query = buildQuery(filter, search, searchFields)

    const candidates = await candidateModel.find(query)

    return res.json({
      message: 'candidates listed successfully',
      success: true,
      details: candidates
    })
  } catch (error) {
    console.log(error.message)
    return res.json({
      message: error || 'something went wrong',
      success: false
    })
  }
}

const fetchCandidate = async (req, res) => {
  try {
    const { id } = req.params

    const candidate = await candidateModel.findOne({ _id: id })

    return res.json({
      message: 'success',
      success: true,
      details: candidate
    })
  } catch (error) {
    return res.json({
      message: error || 'something went wrong',
      success: false
    })
  }
}

//for status update also
const updateCandidate = async (req, res) => {
  try {
    const { id } = req.params
    const data = req.body

    if (!id) {
      return res.json({ message: 'candidate not found', success: false })
    }

    //if resume/file is updated then only it will be added to candidateData
    const candidateData = req.file ? { ...data, resume: req.file.path } : data

    const updatedData = await candidateModel.findOneAndUpdate(
      { _id: id },
      candidateData,
      { new: true }
    )

    if (updatedData?.status === 'Selected') {
      //adding selected employee
      const isExist = await employeeModel.findOne({ email: updatedData?.email })

      if (!isExist) {
        const employee = await employeeModel.create({
          name: updatedData?.name,
          email: updatedData?.email,
          phone_number: updatedData?.phone_number,
          position: updatedData?.position,
          department: 'Development', //adding default department and can be changes according to tne logic changes
          joining_date: new Date()
        })

        //adding in attendance of active employee
        await attendanceModel.create({
          empId: employee._id,
          task: '--',
          status: 'Absent'
        })
      }
    }

    return res.json({
      message: 'candidate updated successfully',
      success: true,
      details: updatedData
    })
  } catch (error) {
    return res.json({
      message: error || 'something went wrong',
      success: false
    })
  }
}

const deleteCandidate = async (req, res) => {
  try {
    const { id } = req.params

    const candidate = await candidateModel.findOneAndDelete({ _id: id })

    return res.json({
      message: 'candidate deleted successfully',
      success: true,
      details: candidate
    })
  } catch (error) {
    return res.json({
      message: error || 'something went wrong',
      success: false
    })
  }
}

module.exports = {
  registerCandidate,
  fetchCandidates,
  fetchCandidate,
  updateCandidate,
  deleteCandidate
}

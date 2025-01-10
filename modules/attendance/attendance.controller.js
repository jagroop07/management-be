const attendanceModel = require('./attendance.model')

const fetchAttendances = async (req, res) => {
  try {
    const { search, filter } = req.body

    const pipeline = [
      {
        $lookup: {
          from: 'employees',
          localField: 'empId',
          foreignField: '_id',
          as: 'employees'
        }
      },
      {
        $unwind: '$employees'
      }
    ]

    if (search) {
      pipeline.push({
        $match: {
          $or: [
            { 'employees.name': { $regex: search, $options: 'i' } },
            { 'employees.dept': { $regex: search, $options: 'i' } },
            { task: { $regex: search, $options: 'i' } }
          ]
        }
      })
    }

    if (filter) {
      const filteredData = Object.entries(filter).map(([key, value]) => ({
        [key]: { $regex: value, $options: 'i' }
      }))

      if (filteredData.length > 0) {
        pipeline.push({
          $match: {
            $and: filteredData
          }
        })
      }
    }

    const attendance = await attendanceModel.aggregate(pipeline)

    return res.status(200).json({
      message: 'listed successfully',
      success: true,
      details: attendance
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'something went wrong'
    })
  }
}

const fetchAttendance = async (req, res) => {
  try {
    const { id } = req.params

    const attendance = await attendanceModel
      .findOne({ _id: id })
      .populate('empId')

    return res.json({
      message: 'success',
      success: true,
      details: attendance
    })
  } catch (error) {
    return res.json({
      message: error || 'something went wrong',
      success: false
    })
  }
}

const updateAttendance = async (req, res) => {
  try {
    const { id } = req.params
    const data = req.body

    const updatedAttendence = await attendanceModel.findOneAndUpdate(
      { _id: id },
      data,
      { new: true }
    )

    return res.json({
      message: 'updated successfully',
      success: true,
      details: updatedAttendence
    })
  } catch (error) {
    return res.json({
      message: error || 'something went wrong',
      success: false
    })
  }
}

const deleteAttendance = async (req, res) => {
  try {
    const { id } = req.params

    const attendance = await attendanceModel.findOneAndDelete({
      _id: id
    })

    return res.json({
      message: 'deleted successfully',
      success: true,
      details: attendance
    })
  } catch (error) {
    return res.json({
      message: error || 'something went wrong',
      success: false
    })
  }
}

module.exports = {
  fetchAttendances,
  fetchAttendance,
  updateAttendance,
  deleteAttendance
}

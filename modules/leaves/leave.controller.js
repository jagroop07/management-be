const leaveModel = require('./leave.model')

const registerLeave = async (req, res) => {
  try {
    const data = req.body

    if (!req.file) {
      return res
        .status(404)
        .json({ message: 'attachement not found', success: false })
    }

    const newLeave = await leaveModel.create({
      ...data,
      attachment: req.file.path
    })

    return res.json({
      message: 'Leave registered',
      success: true,
      details: newLeave
    })
  } catch (error) {
    return res.json({
      message: error || 'something went wrong',
      success: false
    })
  }
}

const fetchLeaves = async (req, res) => {
  try {
    const { date, search, filter } = req.query

    const pipeline = [
      {
        $lookup: {
          from: 'employee',
          localField: 'empId',
          foreignField: '_id',
          as: 'employee'
        }
      },
      {
        $unwind: {
          path: '$employee'
        }
      }
    ]

    if (filter) {
      const filterConditions = Object.entries(filter).map(([key, value]) => ({
        [key]: { $regex: value, $options: 'i' }
      }))
      if (filterConditions.length > 0) {
        pipeline.push({
          $match: {
            $and: filterConditions
          }
        })
      }
    }

    if (search) {
      pipeline.push({
        $match: {
          $or: [
            { 'employee.name': { $regex: search, $options: 'i' } },
            { 'employee.designation': { $regex: search, $options: 'i' } },
            { status: { $regex: search, $options: 'i' } }
          ]
        }
      })
    }

    if (date) {
      const selectedDate = new Date(date)
      selectedDate.setHours(0, 0, 0, 0) //setting time to zero so that only date should be compared
      pipeline.push({
        $match: {
          leave_date: selectedDate
        }
      })
    }

    const leaves = await leaveModel.aggregate(pipeline)

    return res.json({
      message: 'leaves listed successfully',
      success: true,
      details: leaves
    })
  } catch (error) {
    console.log(error.message)
    return res.json({
      message: error || 'something went wrong',
      success: false
    })
  }
}

const fetchLeave = async (req, res) => {
  try {
    const { id } = req.params

    const leave = await leaveModel.findOne({ _id: id }).populate('empId')

    return res.json({
      message: 'success',
      success: true,
      details: leave
    })
  } catch (error) {
    return res.json({
      message: error || 'something went wrong',
      success: false
    })
  }
}

const updateLeave = async (req, res) => {
  try {
    const { id } = req.params
    const data = req.body

    if (!id) {
      return res.json({ message: 'leave not found', success: false })
    }

    const updatedData = req.file ? { ...data, attachment: req.file.path } : data

    const updateLeave = await leaveModel.findOneAndUpdate(
      { _id: id },
      updatedData,
      {
        new: true
      }
    )

    return res.json({
      message: 'updated successfully',
      success: true,
      details: updateLeave
    })
  } catch (error) {
    return res.json({
      message: error || 'something went wrong',
      success: false
    })
  }
}

const deleteLeave = async (req, res) => {
  try {
    const { id } = req.params

    const leave = await leaveModel.findOneAndDelete({ _id: id })

    return res.json({
      message: 'deleted Leave  successfully',
      success: true,
      details: leave
    })
  } catch (error) {
    return res.json({
      message: error || 'something went wrong',
      success: false
    })
  }
}

module.exports = {
  registerLeave,
  fetchLeaves,
  fetchLeave,
  updateLeave,
  deleteLeave
}

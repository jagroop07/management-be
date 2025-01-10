const dotenv = require('dotenv')
dotenv.config()
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const path = require('path')  
const { FRONTEND_URL } = require('./utils/constants')
const DBConnect = require('./config/db.config')
const upload = require('./utils/multer')

//routers import
const adminRouter = require('./modules/admin/admin.routes')
const candidateRouter = require('./modules/candidate/candidate.routes')
const employeeRouter = require('./modules/employees/employee.routes')
const attendanceRouter = require('./modules/attendance/attendance.routes')
const leaveRouter = require('./modules/leaves/leave.routes')
const auth = require('./middleware/auth')

//express instance
const app = express()

//database connection
DBConnect()

//middlewares
app.use(express.json())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
app.use(cookieParser())
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true
  })
)

//routers
app.use('/admin', adminRouter)
app.use('/candidate', auth, upload.single('resume'), candidateRouter)
app.use('/employee', auth, upload.single('profile'), employeeRouter)
app.use('/attendance', auth, attendanceRouter)
app.use('/leave', auth, upload.single('attachment'), leaveRouter)

//server
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`server is running on PORT: ${PORT}`)
})

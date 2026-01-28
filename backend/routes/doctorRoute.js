import express from 'express'
import { appointmentCancel, appointmentComplete, appointmentsDoctor, doctordashboard, doctorList, doctorProfile, editPrescription, loginDoctor, patienthistory, updateDoctorprofile } from '../controllers/doctorController.js'
import authDoctor from '../middlewares/authDoctor.js'

const doctorRouter = express.Router()

doctorRouter.get('/list', doctorList)
doctorRouter.post('/login', loginDoctor)
doctorRouter.get('/appointments', authDoctor, appointmentsDoctor)
doctorRouter.post('/complete-appointment', authDoctor, appointmentComplete)
doctorRouter.post('/cancel-appointment', authDoctor, appointmentCancel)
doctorRouter.get('/patient-history', authDoctor, patienthistory )
doctorRouter.post('/edit-prescription', authDoctor, editPrescription)
doctorRouter.get('/dashboard', authDoctor, doctordashboard)
doctorRouter.get('/profile', authDoctor, doctorProfile)
doctorRouter.post('/update-profile', authDoctor, updateDoctorprofile)



export default doctorRouter
import express from 'express'
import { registerUser, loginUser, getProfile, updateProfile, bookAppointment, listAppointment, cancelAppointment, getUserPrescription, sendPasswordResetOtp, verifyPasswordResetOtp, resetPassword } from '../controllers/userController.js'
import authUser from '../middlewares/authUser.js'
import upload from '../middlewares/multer.js'

const userRouter = express.Router()

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)

userRouter.post('/send-reset-otp', sendPasswordResetOtp)
userRouter.post('/verify-reset-otp', verifyPasswordResetOtp)
userRouter.post('/reset-password', resetPassword)

userRouter.get('/get-profile', authUser ,getProfile)
userRouter.post('/update-profile', upload.single('image'), authUser, updateProfile)
userRouter.post('/book-appointment', authUser, bookAppointment)
userRouter.get('/appointments', authUser, listAppointment)
userRouter.post('/cancel-appointment', authUser, cancelAppointment)
userRouter.post('/get-prescription', authUser, getUserPrescription)  
  
export default userRouter
import validator from 'validator'
import bcrypt from 'bcrypt'
import { v2 as cloudinary } from 'cloudinary'
import doctorModel from '../models/doctorModel.js'
import jwt from 'jsonwebtoken'
import appointmentModel from '../models/appointmentModel.js'
import userModel from '../models/userModel.js'
import prescriptionModel from '../models/prescriptionModel.js'


// API for adding doctor
const addDoctor = async (req,res) => {
   try {
    
    const { name, email, password, phone, speciality, degree, experience, about, fees, address } = req.body
    const imageFile = req.file

    // checking for all data to add doctor
    if( !name || !email || !password || !phone || !speciality || !degree || !experience || !about || !fees || !address ){
        return res.json({success: false, message: "Missing Details"})
    }

    // validating email format
    if(!validator.isEmail(email)) {
      return res.json({success: false, message:'please enter a valid email'})
    }

    // validating strong password
    if(password.length < 8){
       return res.json({success:false, message:'Please enter a strong password'})
    }

    // Check if email already exists
    const existingDoctor = await doctorModel.findOne({ email })
    if(existingDoctor) {
    return res.json({success: false, message: 'Doctor with this email already exists'}) 
    }

    // hashing doctor password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // upload image to cloudinary
    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {resource_type: 'image'})
    const imageUrl = imageUpload.secure_url

    const doctorData = {
        name,
        email,
        image:imageUrl,
        password: hashedPassword,
        phone,
        speciality,
        degree,
        experience,
        about,
        fees,
        address:JSON.parse(address),
        date:Date.now()
    }

    const newDoctor = new doctorModel(doctorData)
    await newDoctor.save()

    res.json({success:true, message: "Doctor Added"})


   } catch (error) {
      console.log(error)
      res.json({ success: false, message: error.message })
   }
}



// API for admin to update doctor profile
const updateDoctorByAdmin = async (req, res) => {
  try {
    const { docId } = req.body
    const {
      name,
      email,
      phone,
      password, // Password optional hai
      speciality,
      degree,
      experience,
      about,
      fees,
      address,
    } = req.body

    const imageFile = req.file

    if (!docId) {
      return res.json({ success: false, message: 'Doctor ID is required' })
    }

    // Check doctor exists
    const doctor = await doctorModel.findById(docId)
    if (!doctor) {
      return res.json({ success: false, message: 'Doctor not found' })
    }

    // Validate email if provided
    if (email && !validator.isEmail(email)) {
      return res.json({ success: false, message: 'Invalid email format' })
    }

    // Password validation ONLY if password is provided and not empty
    if (password && password.trim().length > 0 && password.length < 8) {
      return res.json({ success: false, message: 'Password must be at least 8 characters' })
    }

    let imageUrl = doctor.image

    // Upload new image if provided
    if (imageFile) {
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: 'image'
      })
      imageUrl = imageUpload.secure_url
    }

    //  Hash new password ONLY if provided
    let hashedPassword = doctor.password // Keep old password by default
    if (password && password.trim().length > 0) {
      const salt = await bcrypt.genSalt(10)
      hashedPassword = await bcrypt.hash(password, salt)
    }

    //  Parse address if it's a string
    let addressObj = doctor.address
    if (address) {
      addressObj = typeof address === 'string' ? JSON.parse(address) : address
    }

    // Update data
    const updatedData = {
      name: name || doctor.name,
      email: email || doctor.email,
      password: hashedPassword,
      phone: phone || doctor.phone,
      speciality: speciality || doctor.speciality,
      degree: degree || doctor.degree,
      experience: experience || doctor.experience,
      about: about || doctor.about,
      fees: fees || doctor.fees,
      address: addressObj,  // Object me save hoga
      image: imageUrl
    }

    await doctorModel.findByIdAndUpdate(docId, updatedData)

    res.json({ success: true, message: 'Doctor profile updated successfully' })

  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}




// API For admin login
const loginAdmin = async (req, res) => {
   try {
    
    const { email, password } = req.body

    if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){
      
    const token = jwt.sign(email+password, process.env.JWT_SECRET)
    res.json({success: true, token})  

    } else {
        res.json({success:false, message: 'Invalid credentials'})
    }

   } catch (error) {
    console.log(error)
    res.json({success: false, message:error.message})
   }
}



// API to get all doctor list for admin panel
const allDoctors = async (req,res) => {
   try {
    const doctors = await doctorModel.find({}).select('-password')
    res.json({success: true, doctors})

   } catch (error) {
      console.log(error)
      res.json({success:false, message:error.message})
   }
}


// API to get all appointments list
const appointmentsAdmin = async (req,res) => {
   try {
     const appointments = await appointmentModel.find({})
     res.json({success: true, appointments})

   } catch (error) {
      console.log(error)
      res.json({success: false, message:error.message})
   }
}


// API for appointment cancellation
const appointmentCancel = async (req,res) => {
  try {

   const { appointmentId } = req.body; // ✔ Only appointmentId comes from body

   const appointmentData = await appointmentModel.findById(appointmentId)

   await appointmentModel.findByIdAndUpdate(appointmentId, {cancelled: true})

   // releasing doctor slot
   const { docId, slotDate, slotTime } = appointmentData
   
   const doctorData = await doctorModel.findById(docId)

   let slots_booked = doctorData.slots_booked

   slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime)

   await doctorModel.findByIdAndUpdate(docId, {slots_booked})

   res.json({success: true, message:'Appointment Cancelled'})


  } catch (error) {
    console.log(error)
    res.json({success: false, message: error.message})
  }
}


// API to get all appointment history
const allAppointmentHistory = async (req, res) => {
  try {
    const appointments = await prescriptionModel.find({ });
    res.json({ success: true, appointments });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


// Delete appointment history record
const deleteAppointmentHistory = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    // Check if appointmentId is provided
    if (!appointmentId) {
      return res.json({ success: false, message: 'Appointment ID is required' });
    }

    // Find and delete the prescription/appointment record
    const deletedRecord = await prescriptionModel.findByIdAndDelete(appointmentId);

    if (!deletedRecord) {
      return res.json({ success: false, message: 'Record not found' });
    }
    res.json({ success: true, message: 'Appointment record deleted successfully' });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};




// API to get dashboard data for admin panel
const adminDashboard = async (req,res) => {
   try {
     const doctors = await doctorModel.find({})
     const users = await userModel.find({})
     const appointments = await appointmentModel.find({})

     const dashData = {
      doctors: doctors.length,
      appointments: appointments.length,
      patients: users.length,
      latestAppointments: appointments.reverse().slice(0,5)
     }

     res.json({success: true, dashData})
   } catch (error) {
     console.log(error)
     res.json({success: false, message: error.message}) 
   }

}


export { addDoctor, updateDoctorByAdmin, loginAdmin, allDoctors, appointmentsAdmin, appointmentCancel, adminDashboard, allAppointmentHistory, deleteAppointmentHistory }
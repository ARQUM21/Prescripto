import validator from 'validator'
import bcrypt from 'bcrypt'
import userModel from '../models/userModel.js'
import jwt from 'jsonwebtoken'
import { v2 as cloudinary } from 'cloudinary'
import doctorModel from '../models/doctorModel.js'
import appointmentModel from '../models/appointmentModel.js'
import prescriptionModel from '../models/prescriptionModel.js'
import counterModel from '../models/counterModel.js'
import { PASSWORD_RESET_TEMPLATE } from "../config/EmailTemplates.js";
import transporter from "../config/nodemailer.js";



// Function to get next ID
const getNextPatientId = async () => {
    const counter = await counterModel.findByIdAndUpdate('patientId',
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
    );
    
    return `PAT${counter.seq.toString().padStart(2, '0')}`;
};



// API to register user
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !password || !email) {
            return res.json({success: false, message: 'Missing Details'});
        }

        if (!validator.isEmail(email)) {
            return res.json({success: false, message: 'Enter a valid email'});
        }

        if (password.length < 8) {
            return res.json({success: false, message: 'Enter a strong password'});
        }

        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.json({success: false, message: 'Email already registered'});
        }

        // Counter se ID lo
        const patientId = await getNextPatientId();

        console.log('New Patient ID:', patientId);

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const userData = {
            name,
            email,
            password: hashedPassword,
            patientId: patientId
        };

        const newUser = new userModel(userData);
        const user = await newUser.save();

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET);

        res.json({success: true, token});

    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message});
    }
};




// API for user login
const loginUser = async (req,res) => {
    try {
        
      const { email, password} = req.body
      const user = await userModel.findOne({email})

      if(!user){
       return res.json({success:false, message:'User does not exist'})
      }

      const isMatch = await bcrypt.compare(password,user.password)

      if(isMatch) {
        const token = jwt.sign({id:user._id}, process.env.JWT_SECRET)
        res.json({success:true, token}) 
      } else {
        res.json({success:false, message:'Invalid credentails'})
      }

    } catch (error) {
      console.log(error)
      res.json({success:false,message:error.message})  
    }
}




// Send OTP to email for password reset
export const sendPasswordResetOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.json({ success: false, message: 'Email is required' });
  }

  try {
    // Check if user exists
    const user = await userModel.findOne({ email });
    
    if (!user) {
      return res.json({ success: false, message: 'User not found with this email' });
    }

    // Generate 6-digit OTP
    const otp = String(Math.floor(100000 + Math.random() * 900000));

    // Save OTP in database with expiry time (2 minutes)
    user.resetOtp = otp;
    user.resetOtpExpireAt = Date.now() + 2 * 60 * 1000; 
    await user.save();

    // Send OTP via email using Nodemailer
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: 'Password Reset OTP',
      html: PASSWORD_RESET_TEMPLATE.replace('{{otp}}', otp).replace('{{email}}', user.email)
    };

    await transporter.sendMail(mailOptions);

    return res.json({ 
      success: true, 
      message: 'OTP sent to your email successfully' 
    });

  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};





// Verify the OTP entered by user
export const verifyPasswordResetOtp = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.json({ success: false, message: 'Email and OTP are required' });
  }

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: 'User not found' });
    }

    // Check if OTP is valid
    if (user.resetOtp === '' || user.resetOtp !== otp) {
      return res.json({ success: false, message: 'Invalid OTP' });
    }

    // Check if OTP is expired
    if (user.resetOtpExpireAt < Date.now()) {
      return res.json({ success: false, message: 'OTP has expired' });
    }

     // OTP VERIFIED - AB EXPIRY HATA DO
    user.resetOtpExpireAt = 0; // Expiry remove kar diya
    await user.save();

    return res.json({ 
      success: true, 
      message: 'OTP verified successfully' 
    });

  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};





// Reset password after OTP verification
export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.json({ 
      success: false, 
      message: 'Email, OTP, and new password are required' 
    });
  }

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: 'User not found' });
    }

    // Verify OTP again before resetting password
    if (user.resetOtp === '' || user.resetOtp !== otp) {
      return res.json({ success: false, message: 'Invalid OTP' });
    }


    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password and clear OTP fields
    user.password = hashedPassword;
    user.resetOtp = '';
    user.resetOtpExpireAt = 0;

    await user.save();

    return res.json({ 
      success: true, 
      message: 'Password reset successfully' 
    });

  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};





// API to get user profile data
const getProfile = async (req,res) => {
  try {
    
   const { userId } = req.user
   const userData = await userModel.findById(userId).select('-password')

   res.json({success:true, userData})

  } catch (error) {
    console.log(error)
    res.json({success:false, message:error.message})
  }
}




// API to update user Profile
const updateProfile = async (req,res) => {
  try {
    
    const userId = req.user.userId; 
    const { name, phone, address, dob, gender } = req.body;
    const imageFile = req.file

    if( !name || !phone || !dob || !gender ){
      return res.json({success: false, message:"Data Missing"})
    }

    await userModel.findByIdAndUpdate(userId,{name, phone, address: JSON.parse(address),dob, gender})

    if(imageFile){
      
      // upload image to cloudinary
      const imageUpload = await cloudinary.uploader.upload(imageFile.path,{resource_type: 'image'})
      const imageURL = imageUpload.secure_url

      await userModel.findByIdAndUpdate(userId, {image:imageURL})
    }

    res.json({success: true, message:"Profile Updated"})

  } catch (error) {
    console.log(error)
    res.json({success:false, message:error.message})
  }
}




//  API to book appointment
const bookAppointment = async (req,res) => {

  try {
    
    const userId = req.user.userId; 
    const { docId, slotDate, slotTime } = req.body;
    const docData = await doctorModel.findById(docId).select('-password')

    if(!docData.available){
      return res.json({success: false, message: 'Doctor not available'})
    }


    let slots_booked = docData.slots_booked

    // checking for slot availablity
    if(slots_booked[slotDate]){
      if(slots_booked[slotDate].includes(slotTime)){
        return res.json({success: false, message: 'Slot not available'})
      } else {
        slots_booked[slotDate].push(slotTime)
      }
    } else {
      slots_booked[slotDate] = []
      slots_booked[slotDate].push(slotTime)
    }

    const userData = await userModel.findById(userId).select('-password')
 
    delete docData.slots_booked
    
    const appointmentData = {
      userId,
      docId,
      userData,
      docData,
      amount: docData.fees,
      slotTime, 
      slotDate,
      date: Date.now()
    }

    const newAppointment = new appointmentModel(appointmentData)

    await newAppointment.save()

    // save new slots data in docData
    await doctorModel.findByIdAndUpdate(docId,{slots_booked})

    res.json({success: true, message: 'Appointment Booked'})
  } catch (error) {
    console.log(error)
    res.json({success: false, message: error.message})
  }

}





// API to get user appointments for forntend my-appointments page
const listAppointment = async (req,res) => {
  try {
    
   const userId = req.user.userId;  
   const appointments = await appointmentModel.find({userId})
   
   res.json({ success: true, appointments })

  } catch (error) {
    console.log(error)
    res.json({success: false, message: error.message})
  }
}





//API to cancel appointment
const cancelAppointment = async (req,res) => {
  try {
    
   const userId = req.user.userId;     
   const { appointmentId } = req.body; 

   const appointmentData = await appointmentModel.findById(appointmentId)

   // verify appointment user
   if(appointmentData.userId !== userId){
     return res.json({success: false, message: 'Unauthorized action'})
   }

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




// API to get user's prescription/completed appointment details
const getUserPrescription = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const userId = req.user.userId; 

    console.log('Searching for prescription with:', { appointmentId, userId })

    if (!appointmentId) {
      return res.json({ success: false, message: 'Appointment ID required' });
    }

    // Find prescription by appointmentId field (not _id)
    const prescription = await prescriptionModel.findOne({ 
      appointmentId: appointmentId,  
      userId: userId 
    })
    console.log('Found prescription:', prescription) 

    if (!prescription) {
      return res.json({ success: false, message: 'Prescription not found' });
    }

    res.json({ success: true, prescription });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};




export { registerUser, loginUser, getProfile, updateProfile, bookAppointment, listAppointment, cancelAppointment, getUserPrescription }
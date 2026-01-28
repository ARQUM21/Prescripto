import doctorModel from "../models/doctorModel.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import appointmentModel from "../models/appointmentModel.js"
import prescriptionModel from "../models/prescriptionModel.js"

const changeAvailability = async (req,res) => {
    try {
      const { docId } = req.body
       const docData = await doctorModel.findById(docId)
       await doctorModel.findByIdAndUpdate(docId,{available: !docData.available })
       res.json({success:true, message: 'Availability Changed'})

      } catch (error) {
       console.log(error)
       res.json({success:false, message:error.message}) 
      }
}


const doctorList = async (req,res) => {
   try {      
     const doctors = await doctorModel.find({}).select(['-password', '-email'])
     res.json({success:true, doctors})
   } catch (error) {
      console.log(error)
      res.json({success:false, message:error.message})
   }
}


// API for doctor login
const loginDoctor = async (req,res) => {
   try {
     const { email, password } = req.body
     const doctor = await doctorModel.findOne({email})

     if(!doctor){
        return res.json({success: false, message: 'Invalid credentails'})
      }
   
      const isMatch = await bcrypt.compare(password, doctor.password)
      
      if(isMatch){
         const token = jwt.sign({id:doctor._id}, process.env.JWT_SECRET)
         res.json({success: true, token})
      } else {
         res.json({success: false, message: 'Invalid credentials'})
      }
   } catch (error) {   
   }
} 



// APi to get doctor appointments for doctor panel
const appointmentsDoctor = async (req,res) => {
   try {
      const docId = req.doctor.docId;
      const appointments = await appointmentModel.find({ docId })

      res.json({success: true, appointments})

   } catch (error) {
      console.log(error)
      res.json({success:false, message:error.message})
   }
}



// API to mark appointment completed and save prescription for doctor panel
const appointmentComplete = async (req,res) => {
   try {
      
      const { appointmentId, diagnosis, symptoms, medicines, instructions, nextVisit, labTests, documentation } = req.body
      const docId = req.doctor.docId
      
      // Validation - Required fields check (labTests aur notes optional hain)
      if (!appointmentId || !diagnosis || !symptoms || !medicines || !instructions || !nextVisit || !documentation) {
         return res.json({
            success: false, 
            message: 'Please fill all required fields'
         })
      }

      const appointmentData = await appointmentModel.findById(appointmentId)

      // Check if appointment exists
      if (!appointmentData) {
         return res.json({success: false, message: 'Appointment not found'})
      }

      // Check if appointment belongs to this doctor
      if (appointmentData.docId !== docId) {
         return res.json({success: false, message: 'Unauthorized access'})
      }

      // Check if already completed with prescription
      const existingPrescription = await prescriptionModel.findOne({ appointmentId })
      if (existingPrescription) {
         return res.json({success: false, message: 'Prescription already exists for this appointment'})
      }

      // Prescription save karo with complete data
      const prescription = new prescriptionModel({
         appointmentId,
         userId: appointmentData.userId,
         docId,
         userData: appointmentData.userData,    // Patient details
         docData: appointmentData.docData,      // Doctor details
         slotDate: appointmentData.slotDate,    // Appointment date
         slotTime: appointmentData.slotTime,    // Appointment time
         amount: appointmentData.amount,        // Fees
         diagnosis,
         symptoms,
         medicines,
         instructions,
         nextVisit,
         labTests,              
         documentation,                    
         isEdited: false,
         editHistory: []
      })

      await prescription.save()

      // Appointment complete karo
      await appointmentModel.findByIdAndUpdate(appointmentId, {isCompleted: true})
      
      return res.json({
         success: true, 
         message: 'Appointment completed',
         prescriptionId: prescription._id
      })

   } catch (error) {
      console.log(error)
      res.json({success: false, message: error.message})
   }
}


// API to cancel appointment completed for doctor panel
const appointmentCancel = async (req,res) => {
   try {
      const { appointmentId } = req.body
      const docId = req.doctor.docId
      
      const appointmentData = await appointmentModel.findById(appointmentId)

      if(appointmentData && appointmentData.docId === docId) {
         
        await appointmentModel.findByIdAndUpdate(appointmentId, {cancelled: true})
        return res.json({success: true, message:'Appointment Cancelled'})

      } else {
         return res.json({success: false, message:'cancellation failed'})
      }

   } catch (error) {
      console.log(error)
      res.json({success: false, message: error.message})
   }
}





// API to get doctor patient history for doctor panel
const patienthistory = async (req,res) => {
   try {
      const docId = req.doctor.docId;
      const history = await prescriptionModel.find({ docId }) 
      res.json({success: true, history})  

   } catch (error) {
      console.log(error)
      res.json({success:false, message:error.message})
   }
}




const editPrescription = async (req, res) => {
   try {
      const docId = req.doctor.docId;
      const { prescriptionId, updatedFields } = req.body;

      if (!prescriptionId || !updatedFields) {
         return res.json({ success: false, message: 'Missing data' });
      }

      const prescription = await prescriptionModel.findOne({ 
         _id: prescriptionId,
         docId: docId
      });

      if (!prescription) {
         return res.json({ success: false, message: 'Prescription not found' });
      }

      // Check if already edited
      if (prescription.isEdited) {
         return res.json({ success: false, message: 'Already edited once' });
      }

      // 24-hour check
      const hoursPassed = (Date.now() - new Date(prescription.createdAt)) / (1000 * 60 * 60);
      if (hoursPassed > 24) {
         return res.json({ success: false, message: 'Cannot edit after 24 hours' });
      }

      const allowed = ['diagnosis', 'symptoms', 'medicines', 'instructions', 'nextVisit', 'labTests', 'documentation'];
      const changes = {};
      const updateData = {};

      allowed.forEach(field => {
         const newValue = updatedFields[field];
         const oldValue = prescription[field] || '';
         
         if (newValue !== undefined && oldValue !== newValue) {
            changes[field] = { old: oldValue, new: newValue };
            updateData[field] = newValue;
         }
      });

      if (Object.keys(changes).length === 0) {
         return res.json({ success: false, message: 'No changes detected' });
      }

      await prescriptionModel.findByIdAndUpdate(prescriptionId, {
         ...updateData,
         isEdited: true,
         $push: { 
            editHistory: { 
               changedFields: changes, 
               editedAt: Date.now(), 
               editedBy: docId
            } 
         }
      });

      res.json({ success: true, message: 'Updated successfully' });
   } catch (error) {
      console.log(error);
      res.json({ success: false, message: error.message });
   }
};




// API to get dashboard data for doctor panel
const doctordashboard = async (req,res) => {
    try {
      const { docId } = req.doctor

      const appointments = await appointmentModel.find({ docId })

      let earnings = 0

      appointments.map((item) => {
         if(item.isCompleted || item.payment) {
            earnings += item.amount
         }
      })

      let patients = []

      appointments.map((item) => {
        if(!patients.includes(item.userId)){
           patients.push(item.userId)
        }
      })


      const dashData = {
         earnings,
         appointments: appointments.length,
         patients: patients.length,
         latestAppointments: appointments.reverse().slice(0,5)
      }
      res.json({success: true, dashData})

    } catch (error) {
      console.log(error)
      res.json({success: false, message: error.message})
    }
}



// API to get doctor profile for Doctor Panel
const doctorProfile = async (req,res) => {
   try {      
    const { docId } = req.doctor
    const profileData = await doctorModel.findById(docId).select('-password')

    res.json({ success: true, profileData })

   } catch (error) {
      console.log(error)
      res.json({success: false, message: error.message})
   }
}



// API to update doctor profile data from Doctor panel
const updateDoctorprofile = async (req,res) => {
  try {
   const { docId } = req.doctor; 
   const { fees, address, available } = req.body;

   await doctorModel.findByIdAndUpdate(docId, {fees, address, available})

   res.json({ success: true, message: 'Profile Updated'})

  } catch (error) {
   console.log(error)
   res.json({success: false, message: error.message})
  }

}



export { changeAvailability, doctorList, loginDoctor, appointmentsDoctor, appointmentComplete, appointmentCancel, doctordashboard, doctorProfile, updateDoctorprofile, patienthistory, editPrescription}
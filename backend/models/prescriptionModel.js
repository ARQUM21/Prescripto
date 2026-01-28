import mongoose from 'mongoose';

const prescriptionSchema = new mongoose.Schema({
    // Basic IDs
    appointmentId: { type: String, required: true },
    userId: { type: String, required: true },
    docId: { type: String, required: true },

    userData: {
      name: String,
      email: String,
      patientId: String,
      image: String,
      phone: String,
      gender: String,
      dob: String,
      address: {
         line1: String,
         line2: String
      }
   },
   docData: {
      image: String,
      name: String,
      email: String,
      speciality: String,
      degree: String,
      experience: String,
      fees: String,
      address: {
         line1: String,
         line2: String
      }
   },

    // Appointment Details (History ke liye)
    slotDate: { type: String, required: true },
    slotTime: { type: String, required: true },
    amount: { type: Number, required: true },

    // Medical Details (Jo doctor form mein fill karega)
    diagnosis: { type: String, required: true },
    symptoms: { type: String, required: true },
    medicines: { type: String, required: true },
    instructions: { type: String, required: true },
    nextVisit: { type: String, required: true },
    labTests: { type: String, default: '' },     
    documentation: { type: String, default: '' },   

    // Edit History - Track all changes
    editHistory: [{
        changedFields: { type: Object, required: true }, // {diagnosis: "old -> new"}
        editedAt: { type: Date, default: Date.now },
        editedBy: { type: String, required: true }, // docId
 
    }],

    // Flag to show if edited
    isEdited: { type: Boolean, default: false }


}, { minimize: false, timestamps: true  })

const prescriptionModel = mongoose.models.prescription || mongoose.model('prescription', prescriptionSchema)

export default prescriptionModel
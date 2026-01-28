import { useState } from "react";
import { createContext } from "react";
import axios from 'axios'
import { toast } from 'react-toastify'

export const DoctorContext = createContext()

const DoctorContextProvider = (props) => {
    
    const backendUrl = import.meta.env.VITE_BACKEND_URL


    const [dToken, setDToken] = useState(localStorage.getItem('dToken')? localStorage.getItem('dToken'): '')
    const [appointments, setAppointments] = useState([])
    const [history, setHistory] = useState([])
    const [dashData, setDashData] = useState(false)
    const [profileData, setProfileData] = useState(false)

    const getAppointments = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/doctor/appointments', {headers: {dToken}})
            if(data.success){
               setAppointments(data.appointments)
               
            } else {
               toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }


    const completeAppointment = async (appointmentId, formData) => {
    try {
    const { data } = await axios.post(backendUrl + '/api/doctor/complete-appointment', {
        appointmentId,
        diagnosis: formData.diagnosis,
        symptoms: formData.symptoms,
        medicines: formData.medicines,
        instructions: formData.instructions,
        nextVisit: formData.nextVisit,
        labTests: formData.labTests, 
        documentation: formData.documentation
    }, {headers: {dToken}})
    
    if(data.success){
      toast.success(data.message)
      getAppointments()
      return true  
    } else {
        toast.error(data.message)
        return false
    }
    } catch (error) {
    console.log(error)
    toast.error(error.message)
    return false
   }
   }


    const cancelAppointment = async (appointmentId) => {
       try {
        const { data } = await axios.post(backendUrl + '/api/doctor/cancel-appointment', {appointmentId}, {headers: {dToken}})
        if(data.success){
          toast.success(data.message)
          getAppointments()
        } else {
            toast.error(data.message)
        }
       } catch (error) {
        console.log(error)
        toast.error(error.message)
       }
    }


    const getpatienthistory = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/doctor/patient-history', {headers: {dToken}})
            if(data.success){
               setHistory(data.history)
            } else {
               toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const editPrescription = async (prescriptionId, updatedFields) => {
    try {
    const { data } = await axios.post( backendUrl + '/api/doctor/edit-prescription', { prescriptionId, updatedFields }, { headers: { dToken } })
    
    if (data.success) {
      toast.success(data.message)
      return true
    } else {
      toast.error(data.message)  
    }
    } catch (error) {
    toast.error(error.message)    
    }
   }



    const getDashData = async () => {
        try {            
           const { data } = await axios.get(backendUrl + '/api/doctor/dashboard', {headers: {dToken}})
           if(data.success) {
             setDashData(data.dashData)
           } else {
            toast.error(data.message)
           }
        } catch (error) {
            toast.error(error.message)
        }
    }



    const getProfileData = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/doctor/profile', { headers: {dToken}})
            if(data.success){
               setProfileData(data.profileData)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }
    
    const value = {
       dToken, setDToken,
       backendUrl, 
       appointments, setAppointments,
       getAppointments,completeAppointment,cancelAppointment, 
       history, setHistory, getpatienthistory,
       dashData, setDashData, getDashData,
       profileData, setProfileData,
       getProfileData, editPrescription
    }

    return (
        <DoctorContext.Provider value={value}>
           {props.children}
        </DoctorContext.Provider>
    )
}

export default DoctorContextProvider
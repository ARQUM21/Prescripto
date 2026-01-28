import { createContext, useEffect, useState } from "react";
import axios from 'axios'
import { toast } from "react-toastify";

export const AppContext = createContext()

const AppContextProvider = (props) => {

  const currencySymbol = 'Rs '
  const backendUrl = import.meta.env.VITE_BACKEND_URL
  
  const [doctors, setDoctors] = useState([])
  const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : false)
  const [userData, setUserData] = useState(false)
  const [appointments, setAppointments] = useState([])

  // UTILITY FUNCTIONS 
  const calculateAge = (dob) => {
    const today = new Date()
    const birthDate = new Date(dob)
    let age = today.getFullYear() - birthDate.getFullYear()
    return age
  }

  const months = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split('_')
    return dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2]
  }

  
  // DOCTORS API 
  const getDoctorsData = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/doctor/list')
      if (data.success) {
        setDoctors(data.doctors)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  
  // USER PROFILE API 
  const loadUserProfileData = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/user/get-profile', { headers: { token } })
      if (data.success) {
        setUserData(data.userData)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  
  //  APPOINTMENTS API 
  const getUserAppointments = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/user/appointments', { headers: { token } })
      
      if (data.success) {
        setAppointments(data.appointments.reverse())
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }


  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + '/api/user/cancel-appointment',
        { appointmentId },
        { headers: { token } }
      )

      if (data.success) {
        toast.success(data.message)
        getUserAppointments() 
        getDoctorsData() 
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  
  // PRESCRIPTION API 
  const getUserPrescription = async (appointmentId) => {
    try {
      
      const { data } = await axios.post(
        backendUrl + '/api/user/get-prescription',
        { appointmentId },
        { headers: { token } }
      )

      console.log('📄 API Response:', data)

      if (data.success) {
        return data.prescription
      } else {
        toast.error(data.message)
        return null
      }
    } catch (error) {
      toast.error(error.message)
      return null
    }
  }




  //  PASSWORD RESET APIs 
  const sendPasswordResetOtp = async (email, navigate) => {
   try {
    const { data } = await axios.post(backendUrl + '/api/user/send-reset-otp', { email })
    
    if (data.success) {
      toast.success(data.message)
      navigate("/otp-verify", { state: { email } })
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

  const verifyPasswordResetOtp = async (email, otp, navigate) => {
   try {
    const { data } = await axios.post(backendUrl + '/api/user/verify-reset-otp', { email, otp })
    
    if (data.success) {
      toast.success(data.message)
      navigate("/reset-password", { state: { email, otp } })
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

  const resetPassword = async (email, otp, newPassword, navigate) => {
   try {
    const { data } = await axios.post(backendUrl + '/api/user/reset-password', { 
      email, 
      otp, 
      newPassword 
    })
    
    if (data.success) {
      toast.success(data.message)
      // Navigate to login after 1 seconds
      setTimeout(() => {
        navigate("/login")
      }, 500)
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




  // CONTEXT VALUE 
  const value = {
    // State
    doctors,
    token,
    setToken,
    userData,
    setUserData,
    appointments,
    currencySymbol,
    backendUrl,

    // Utility Functions
    calculateAge,
    slotDateFormat,

    // API Functions
    getDoctorsData,
    loadUserProfileData,
    getUserAppointments,
    cancelAppointment,
    getUserPrescription,
    
    sendPasswordResetOtp,
    verifyPasswordResetOtp,
    resetPassword,
  }

  //  EFFECTS 
  useEffect(() => {
    getDoctorsData()
  }, [])

  useEffect(() => {
    if (token) {
      loadUserProfileData()
      getUserAppointments()
    } else {
      setUserData(false)
      setAppointments([])
    }
  }, [token])

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  )
}

export default AppContextProvider
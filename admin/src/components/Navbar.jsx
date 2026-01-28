import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { AdminContext } from '../context/AdminContext'
import { useNavigate } from 'react-router-dom'
import { DoctorContext } from '../context/DoctorContext'

const Navbar = () => {
  const { aToken, setAToken } = useContext(AdminContext)
  const { dToken, setDToken } = useContext(DoctorContext)
  
  const navigate = useNavigate()
  
  const logout = () => {
    navigate('/')
    aToken && setAToken('')
    aToken && localStorage.removeItem('aToken')
    dToken && setDToken('')
    dToken && localStorage.removeItem('dToken')
  }
  
  return (
    <div className='fixed top-0 left-0 right-0 z-50 h-16 flex justify-between items-center px-4 md:px-6 py-3 border-b bg-white shadow-sm'>
      <div className='flex items-center gap-2 md:gap-3'>
        <img className='w-28 sm:w-36 md:w-40 cursor-pointer' src={assets.admin_logo} alt="Admin Logo" />
        <p className='border px-2 sm:px-2.5 py-0.5 rounded-full border-gray-500 text-gray-600 text-[10px] sm:text-xs md:text-sm font-medium whitespace-nowrap'>
          {aToken ? 'Admin' : 'Doctor'}
        </p>
      </div>

      <button onClick={logout} className='bg-primary text-white text-xs sm:text-sm md:text-base px-4 sm:px-6 md:px-10 py-1.5 sm:py-2 rounded-full hover:bg-primary/90 transition-colors font-medium'>
        Logout
      </button>
    </div>
  )
}

export default Navbar
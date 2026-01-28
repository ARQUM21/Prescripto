import React, { useContext } from 'react'
import { AdminContext } from '../context/AdminContext'
import { NavLink } from 'react-router-dom'
import { assets } from '../assets/assets'
import { DoctorContext } from '../context/DoctorContext'
import { ClipboardList } from 'lucide-react'

const Sidebar = () => {
  const { aToken } = useContext(AdminContext)
  const { dToken } = useContext(DoctorContext)

  return (
    <div className='fixed left-0 top-16 bottom-0 w-14 sm:w-16 md:w-64 bg-white border-r overflow-y-auto z-40'>
      {aToken && (
        <ul className='text-[#515151] mt-5'>
          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-2 md:gap-3 py-3 md:py-3.5 px-2 sm:px-3 md:px-6 cursor-pointer hover:bg-gray-50 transition-colors 
            ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}`}
            to={'/admin-dashboard'}
            >
            <img className='w-4 sm:w-5 md:w-6 flex-shrink-0' src={assets.home_icon} alt="Dashboard" />
            <p className='hidden md:block text-sm lg:text-base'>Dashboard</p>
          </NavLink>

          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-2 md:gap-3 py-3 md:py-3.5 px-2 sm:px-3 md:px-6 cursor-pointer hover:bg-gray-50 transition-colors 
            ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}`}
            to={'/all-appointments'}
            >
            <img className='w-4 sm:w-5 md:w-6 flex-shrink-0' src={assets.appointment_icon} alt="Appointments" />
            <p className='hidden md:block text-sm lg:text-base'>Appointments</p>
          </NavLink>

          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-2 md:gap-3 py-3 md:py-3.5 px-2 sm:px-3 md:px-6 cursor-pointer hover:bg-gray-50 transition-colors 
            ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}`
            }
            to={'/appointment-history'}
            >
            <ClipboardList className='w-5 sm:w-5 md:w-6 flex-shrink-0 text-gray-800' />
            <p className='hidden md:block text-sm lg:text-base'>Appointment History</p>
          </NavLink>

          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-2 md:gap-3 py-3 md:py-3.5 px-2 sm:px-3 md:px-6 cursor-pointer hover:bg-gray-50 transition-colors 
            ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}`
            }
            to={'/add-doctor'}
            >
            <img className='w-4 sm:w-5 md:w-6 flex-shrink-0' src={assets.add_icon} alt="Add Doctor" />
            <p className='hidden md:block text-sm lg:text-base'>Add Doctor</p>
          </NavLink>

          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-2 md:gap-3 py-3 md:py-3.5 px-2 sm:px-3 md:px-6 cursor-pointer hover:bg-gray-50 transition-colors 
            ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}`
            }
            to={'/doctor-list'}
            >
            <img className='w-4 sm:w-5 md:w-6 flex-shrink-0' src={assets.people_icon} alt="Doctors" />
            <p className='hidden md:block text-sm lg:text-base'>Doctors List</p>
          </NavLink>
        </ul>
      )}

      {dToken && (
        <ul className='text-[#515151] mt-5'>
          <NavLink
            className={({ isActive }) => 
              `flex items-center gap-2 md:gap-3 py-3 md:py-3.5 px-4 md:px-6 cursor-pointer hover:bg-gray-50 transition-colors 
            ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}`
            }
            to={'/doctor-dashboard'}
            >
            <img className='w-4 sm:w-5 md:w-6 flex-shrink-0' src={assets.home_icon} alt="Dashboard" />
            <p className='hidden md:block text-sm lg:text-base'>Dashboard</p>
          </NavLink>

          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-2 md:gap-3 py-3 md:py-3.5 px-4 md:px-6 cursor-pointer hover:bg-gray-50 transition-colors 
            ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}`
            }
            to={'/doctor-appointments'}
            >
            <img className='w-4 sm:w-5 md:w-6 flex-shrink-0' src={assets.appointment_icon} alt="Appointments" />
            <p className='hidden md:block text-sm lg:text-base'>Appointments</p>
          </NavLink>

          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-2 md:gap-3 py-3 md:py-3.5 px-4 md:px-6 cursor-pointer hover:bg-gray-50 transition-colors 
            ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}`
            }
            to={'/patient-history'}
            >
            <ClipboardList className='w-5 sm:w-5 md:w-6 flex-shrink-0 text-gray-800' />
            <p className='hidden md:block text-sm lg:text-base'>Patient History</p>
          </NavLink>

          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-2 md:gap-3 py-3 md:py-3.5 px-4 md:px-6 cursor-pointer hover:bg-gray-50 transition-colors 
            ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}`
            }
            to={'/doctor-profile'}
            >
            <img className='w-4 sm:w-5 md:w-6 flex-shrink-0' src={assets.people_icon} alt="Profile" />
            <p className='hidden md:block text-sm lg:text-base'>Profile</p>
          </NavLink>

        </ul>
      )}
      
    </div>
  )
}

export default Sidebar
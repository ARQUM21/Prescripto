import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const Doctors = () => {

  const { speciality } = useParams()
  const [filterDoc, setFilterDoc] = useState([])
  const [showFilter, setShowFilter] = useState(false)
  const [loading, setLoading] = useState(true)

  const navigate = useNavigate()

  const {token, doctors } = useContext(AppContext);

  const applyFilter = () => {
    if(speciality) {
      setFilterDoc(doctors.filter(doc => doc.speciality === speciality))
    } else {
      setFilterDoc(doctors);
    }
  }

  useEffect(() => {
    if (doctors && doctors.length >= 0) {
      applyFilter()
      setLoading(false)
    }
  }, [doctors, speciality])

  return (
    <div>
      {/* Header Section - Desktop Button Right Side */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className='text-xl sm:text-2xl font-bold text-gray-900'>Find Your Doctor</h1>
          <p className='text-sm sm:text-base text-gray-600 mt-1'>Browse through specialist doctors for your needs</p>
        </div>
        
        {/* Button - Mobile Full Width, Desktop Right Side */}
        {token && (
          <button onClick={() => navigate('/my-appointments')} 
            className='w-full sm:w-auto bg-primary text-white px-6 py-3 rounded-lg sm:rounded-full font-medium cursor-pointer hover:bg-primary-dark transition shadow-md hover:shadow-lg text-sm sm:text-base whitespace-nowrap'
          >
            View My Appointments
          </button>
        )}
      </div>
        
      <div className='flex flex-col sm:flex-row items-start gap-5 mt-5'>
        
        {/* Filter Toggle Button */}
        <button 
          className={`py-2 px-4 border rounded text-sm transition-all sm:hidden ${showFilter ? 'bg-primary text-white' : ''}`} 
          onClick={() => setShowFilter(prev => !prev)}
        >
          {showFilter ? '✕ Close Filters' : '☰ Filters'}
        </button>
        
        {/* Filters Sidebar - Inline on Same Page */}
        <div className={`w-full sm:w-auto flex-col gap-4 text-sm text-gray-600 ${showFilter ? 'flex' : 'hidden sm:flex'}`}>
          <p onClick={() => speciality === 'General physician' ? navigate('/doctors') : navigate('/doctors/General physician')} className={`w-full sm:w-auto pl-3 py-2 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === "General physician" ? "bg-indigo-100 text-black" : ""} `}>General physician</p>
          <p onClick={() => speciality === 'Gynecologist' ? navigate('/doctors') : navigate('/doctors/Gynecologist')} className={`w-full sm:w-auto pl-3 py-2 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === "Gynecologist" ? "bg-indigo-100 text-black" : ""} `}>Gynecologist</p>
          <p onClick={() => speciality === 'Dermatologist' ? navigate('/doctors') : navigate('/doctors/Dermatologist')} className={`w-full sm:w-auto pl-3 py-2 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === "Dermatologist" ? "bg-indigo-100 text-black" : ""} `}>Dermatologist</p>
          <p onClick={() => speciality === 'Pediatricians' ? navigate('/doctors') : navigate('/doctors/Pediatricians')} className={`w-full sm:w-auto pl-3 py-2 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === "Pediatricians" ? "bg-indigo-100 text-black" : ""} `}>Pediatricians</p>
          <p onClick={() => speciality === 'Neurologist' ? navigate('/doctors') : navigate('/doctors/Neurologist')} className={`w-full sm:w-auto pl-3 py-2 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === "Neurologist" ? "bg-indigo-100 text-black" : ""} `}>Neurologist</p>
          <p onClick={() => speciality === 'Gastroenterologist' ? navigate('/doctors') : navigate('/doctors/Gastroenterologist')} className={`w-full sm:w-auto pl-3 py-2 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === "Gastroenterologist" ? "bg-indigo-100 text-black" : ""}`}>Gastroenterologist</p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="w-full grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="border border-gray-200 rounded-xl overflow-hidden animate-pulse">
                <div className="bg-gray-200 h-40 sm:h-56 w-full"></div>
                <div className="p-3 sm:p-4">
                  <div className="h-3 bg-gray-200 rounded w-24 mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-32 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-20"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className='w-full grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4'>
            {
              filterDoc.map((item,index) => (
                <div onClick={() => navigate(`/appointment/${item._id}`)} className='border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500' key={index}>
                  {/* Bigger Image Height */}
                  <img className='bg-blue-50 w-full h-40 sm:h-56 object-cover' src={item.image} alt="" />
                  
                  {/* More Padding */}
                  <div className='p-3 sm:p-4'>
                    <div className={`flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm ${item.available ? 'text-green-500' : 'text-gray-500'} `}>
                      <p className={`w-1.5 h-1.5 sm:w-2 sm:h-2 ${item.available ? 'bg-green-500' : 'bg-gray-500'} rounded-full`}></p>
                      <p>{item.available ? 'Available' : 'Not Available'}</p>
                    </div>
                    <p className='text-gray-900 text-sm sm:text-lg font-medium mt-2 line-clamp-2'>{item.name}</p>
                    <p className='text-gray-600 text-xs sm:text-sm mt-1'>{item.speciality}</p>
                  </div>
                </div>   
              ))
            }
          </div>
        )}
      </div>
    </div>
  )
}

export default Doctors
import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const TopDoctors = () => {

   const navigate = useNavigate()
   const { doctors } = useContext(AppContext)

  return (
    <div className='flex flex-col items-center gap-4 py-16 text-gray-800'>
      
      {/* Header */}
      <div className="max-w-6xl mx-auto text-center mb-6 md:mb-10 px-4">
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
          Top <span className="text-primary">Doctors</span> to Book
        </h1>
        <p className="text-gray-600 text-xs sm:text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
          Simply browse through our extensive list of trusted doctors
        </p>
      </div>

      {/* Doctors Grid  */}
      <div className='w-full grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 gap-y-6 px-3 sm:px-0 max-w-6xl mx-auto'>
        {doctors.slice(0,8).map((item,index) => (
            <div 
              onClick={() => {navigate(`/appointment/${item._id}`); scrollTo(0, 0);}} 
              className='border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500' 
              key={index}
            >
               <img className='bg-blue-50 w-full h-40 sm:h-56 object-cover' src={item.image} alt="" />
              
               <div className='p-3 sm:p-4'>
                <div className={`flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm ${item.available ? 'text-green-500' : 'text-gray-500'}`}>
                  <p className={`w-1.5 h-1.5 sm:w-2 sm:h-2 ${item.available ? 'bg-green-500' : 'bg-gray-500'} rounded-full`}></p>
                  <p>{item.available ? 'Available' : 'Not Available'}</p>
                </div>
                 <p className='text-gray-900 text-sm sm:text-lg font-medium mt-2 line-clamp-2'>{item.name}</p>
                 <p className='text-gray-600 text-xs sm:text-sm mt-1'>{item.speciality}</p>
               </div>
            </div>   
        ))}
      </div>

      {/* Responsive Button */}
      <button 
        onClick={() => { navigate('/doctors'); scrollTo(0,0) }} 
        className='bg-blue-50 text-gray-600 px-8 sm:px-12 py-2.5 sm:py-3 rounded-full mt-6 sm:mt-10 text-sm sm:text-base font-medium hover:bg-blue-100 transition-all cursor-pointer'
      >
        View More Doctors
      </button>
    </div>
  )
}

export default TopDoctors
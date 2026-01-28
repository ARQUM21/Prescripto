import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { Phone, Mail } from 'lucide-react'

const Footer = () => {
  const navigate = useNavigate()

  return (
    <div className='px-4 sm:px-6 md:px-10'>
      
      <div className='flex flex-col sm:grid sm:grid-cols-[1.5fr_1fr_1fr] md:grid-cols-[1.5fr_1fr_1fr] gap-8 sm:gap-10 md:gap-14 my-10 mt-20 sm:mt-32 md:mt-40 text-sm'>

        {/* -------- Left Section -------- */}
        <div>
          <img className='mb-4 sm:mb-5 w-32 sm:w-36 md:w-40 cursor-pointer' src={assets.logo} alt="Prescripto Logo" 
            onClick={() => {navigate('/'), scrollTo(0,0) }} />
          <p className='w-full md:w-2/3 text-gray-600 leading-6 text-sm sm:text-base'>
            Simplifying healthcare access through smart appointment management. Book your doctor, anytime, anywhere with Prescripto's intelligent scheduling system. No more long waits or booking hassles - just efficient, reliable, and patient-focused healthcare at your convenience.
          </p>
        </div>
      
        
        {/* -------- Center Section -------- */}
        <div>
          <p className='text-lg sm:text-xl font-medium mb-4 sm:mb-5'>COMPANY</p>
          <ul className='flex flex-col gap-2 text-gray-600 text-sm sm:text-base'>
            <li className='hover:text-gray-900 cursor-pointer transition-colors duration-200' onClick={() => {navigate('/'), scrollTo(0,0) }} >
              Home
            </li>

            <li className='hover:text-gray-900 cursor-pointer transition-colors  duration-200'onClick={() => {navigate('/about'), scrollTo(0,0)  }} >
              About
            </li>

            <li className='hover:text-gray-900 cursor-pointer transition-colors duration-200' onClick={() => {navigate('/contact'), scrollTo(0,0) }} >
              Contact Us
            </li>

          </ul>
        </div>

         
        {/* -------- Right Section - RESPONSIVE TEXT & ICONS -------- */}
        <div>
          <p className='text-lg sm:text-xl font-medium mb-4 sm:mb-5'>GET IN TOUCH</p>
          <ul className='flex flex-col gap-3 sm:gap-4 text-gray-600'>
            
            {/* Phone - Lucide Icon */}
            <li className='flex items-start gap-2 group'>
              <Phone className='w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-primary mt-1' />
              <div>
                <p className='font-medium text-gray-900 text-xs sm:text-sm md:text-base'>Phone</p>
                <a href="tel:+923432705821" className='text-gray-600 hover:text-primary transition-colors text-xs sm:text-sm md:text-base'>
                  +92 343 2705821
                </a>
              </div>
            </li>

            {/* Email - Lucide Icon */}
            <li className='flex items-start gap-2 group'>
              <Mail className='w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-primary mt-1' />
              <div>
                <p className='font-medium text-gray-900 text-xs sm:text-sm md:text-base'>Email</p>
                <a href="mailto:marqum987@gmail.com" className='text-gray-600 hover:text-primary transition-colors break-all text-xs sm:text-sm md:text-base'>
                  marqum987@gmail.com
                </a>
              </div>
            </li>

          </ul>
        </div>

      </div>


      {/* -------- Copyright Text -------- */}
      <div>
        <hr className='border-gray-300' />
        <p className='py-4 sm:py-5 text-xs sm:text-sm text-center text-gray-600'>
          Copyright 2026© Prescripto - All Rights Reserved.
        </p>
      </div>

    </div>
  )
}

export default Footer
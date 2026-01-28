import React from 'react'
import { assets } from '../assets/assets'

const About = () => {
  return (
    <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
      {/* Header Section */}
      <div className='text-center text-xl sm:text-2xl lg:text-3xl pt-10 text-gray-500'>
        <p>ABOUT <span className='text-gray-700 font-medium'>US</span></p>
      </div>

      {/* About Content Section */}
      <div className='my-10 flex flex-col md:flex-row gap-8 md:gap-12 items-center md:items-start'>
        <img className='w-full md:max-w-[360px] rounded-lg shadow-lg'  src={assets.about_image} alt="About Prescripto Healthcare" />
        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-sm sm:text-base text-gray-600'>
          <p>Welcome to Prescripto, your trusted partner in managing your healthcare needs conveniently and efficiently. At Prescripto, we understand the challenges individuals face when it comes to scheduling doctor appointments and managing their health records.</p>

          <p>Prescripto is committed to excellence in healthcare technology. We continuously strive to enhance our platform, integrating the latest advancements to improve user experience and deliver superior service. Whether you're booking your first appointment or managing ongoing care, Prescripto is here to support you every step of the way.</p>
          
          <b className='text-gray-800 text-base sm:text-lg'>Our Vision</b>
          
          <p>Our vision at Prescripto is to create a seamless healthcare experience for every user. We aim to bridge the gap between patients and healthcare providers, making it easier for you to access the care you need, when you need it.</p>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className='text-xl sm:text-2xl lg:text-3xl my-8 text-center'>
        <p>WHY <span className='text-gray-700 font-semibold'>CHOOSE US</span></p>
      </div>

      {/* Feature Cards */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 mb-20'>
        <div className='border border-gray-200 px-8 sm:px-10 md:px-12 py-10 sm:py-14 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white hover:shadow-lg transition-all duration-300 text-gray-600 cursor-pointer rounded-lg'>
          <b className='text-base sm:text-lg'>Efficiency:</b>
          <p>Streamlined appointment scheduling that fits into your busy lifestyle.</p>
        </div>

        <div className='border border-gray-200 px-8 sm:px-10 md:px-12 py-10 sm:py-14 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white hover:shadow-lg transition-all duration-300 text-gray-600 cursor-pointer rounded-lg'>
          <b className='text-base sm:text-lg'>Convenience:</b>
          <p>Access to a network of trusted healthcare professionals in your area.</p>
        </div>

        <div className='border border-gray-200 px-8 sm:px-10 md:px-12 py-10 sm:py-14 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white hover:shadow-lg transition-all duration-300 text-gray-600 cursor-pointer rounded-lg'>
          <b className='text-base sm:text-lg'>Personalization:</b>
          <p>Tailored recommendations and reminders to help you stay on top of your health.</p>
        </div>
      </div>
    </div>
  )
}

export default About
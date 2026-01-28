import React from 'react'
import { assets } from '../assets/assets'

const Contact = () => {
  return (
    <div>
      <div className='text-center text-2xl pt-10 text-gray-500'>
        <p>CONTACT <span className='text-gray-700 font-semibold' >US</span></p>
      </div>

      <div className='my-10 flex flex-col justify-center md:flex-row gap-10 mb-28 text-sm'>
        <img className='w-full md:max-w-[360px] rounded-lg shadow-lg' src={assets.contact_image} alt="" />
        <div className='flex flex-col justify-center items-start gap-6' >
          <p className='font-semibold text-lg text-gray-600' >Our office</p>
          <p className='text-gray-500'>54709 willms Station <br /> Suite 350, karachi, Pakistan</p>
          <p className='text-gray-500'>Tel: +92 343 2705821 <br />Email: marqum987@gmail.com</p>
          <p className='font-semibold text-lg text-gray-600'>Emergency Support</p>
          <p className='text-gray-500 '>For urgent medical assistance, please call: <br />
          <span className='font-semibold text-gray-700'>+92 343 2705821</span> (24/7 Available)</p>
        </div>
      </div>
    </div>
  )
}

export default Contact

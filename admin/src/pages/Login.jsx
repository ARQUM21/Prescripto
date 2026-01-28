import React, { useContext, useState } from 'react'
import { AdminContext } from '../context/AdminContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { DoctorContext } from '../context/DoctorContext'
import { Eye, EyeOff } from 'lucide-react'
 
const Login = () => {
  
  const [state, setState] = useState('Admin')
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const {setAToken, backendUrl} = useContext(AdminContext)
  const {setDToken} = useContext(DoctorContext)


  const onSubmithandler = async (e) => {
    event.preventDefault()

    try {
     if(state === 'Admin') {
      const { data } = await axios.post(backendUrl + '/api/admin/login', {email, password})
      if(data.success) {
        localStorage.setItem('aToken', data.token)
        setAToken(data.token)
      } else {
        toast.error(data.message)
      }
     } else {
         
      const { data } = await axios.post(backendUrl + '/api/doctor/login', {email, password})
      if(data.success) {
        localStorage.setItem('dToken', data.token)
        setDToken(data.token)
        console.log(data.token)
      } else {
        toast.error(data.message)
      }
     }
    } catch (error) {
    }
  }


  
  return (
    <form onSubmit={onSubmithandler} className='min-h-[80vh] flex items-center'>
      <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg'>
        <p className='text-2xl font-semibold m-auto' ><span className='text-primary'>{state}</span> Login</p>
        <div className='w-full'>
          <p>Email</p>
          <input onChange={(e) => setEmail(e.target.value)} value={email} className='border border-[#DADADA] rounded w-full p-2 mt-1' type="email" required />
        </div>
        <div className='w-full'>
          <p>Password</p>
          <div className='relative' >
          <input onChange={(e) => setPassword(e.target.value)} value={password} className='border border-[#DADADA] rounded w-full p-2 mt-1'
          type={showPassword ? "text" : "password"}
          required 
          />
          <button
            type='button'
            onClick={() => setShowPassword(!showPassword)}
            className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700'
          >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
          </div>
        </div>
        <button className='bg-primary text-white w-full py-2 rounded-md text-base cursor-pointer '>Login</button>
        {
          state === 'Admin'
          ? <p>Doctor Login? <span className='text-primary underline cursor-pointer' onClick={() => setState('Doctor')} >Click here</span></p>
          : <p>Admin Login? <span className='text-primary underline cursor-pointer' onClick={() => setState('Admin')} >Click here</span></p>
        }
      
      </div>
    </form>
  )
}

export default Login

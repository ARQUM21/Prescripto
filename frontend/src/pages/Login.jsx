import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, User, Mail, Lock } from 'lucide-react'

const Login = () => {

  const { backendUrl, token, setToken } = useContext(AppContext)
  const navigate = useNavigate()
  
  const [state, setState] = useState('Sign Up')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  
  const onSubmitHandler = async (event) => {
    event.preventDefault()
    setLoading(true)

    try {
      
      if(state === 'Sign Up'){

        const { data } = await axios.post(backendUrl + '/api/user/register', {name, password, email})
        if(data.success) {
          localStorage.setItem('token', data.token)
          setToken(data.token)
        } else {
          toast.error(data.message)
        }

      } else {

        const { data } = await axios.post(backendUrl + '/api/user/login', { password, email})
        if(data.success) {
          localStorage.setItem('token', data.token)
          setToken(data.token)
        } else {
          toast.error(data.message)
        }

      }

    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if(token){
     navigate('/')
    }
  },[token])

  return (
    <div className='min-h-[80vh] flex items-center justify-center px-4 py-8'>
      <form onSubmit={onSubmitHandler} className='w-full max-w-md p-6 sm:p-8 border rounded-xl shadow-lg bg-white'>
        
        {/* Title */}
        <h1 className='text-xl sm:text-2xl font-semibold text-center mb-2 text-gray-800'>
          {state === 'Sign Up' ? 'Create Account' : 'Welcome Back'}
        </h1>
        <p className='text-center text-gray-600 text-xs sm:text-sm mb-6'>
          Please {state === 'Sign Up' ? 'sign up' : 'login'} to book appointment
        </p>
        
        {/* Name Field (Sign Up Only) */}
        {state === 'Sign Up' && (
          <div className='mb-4'>
            <label className='block text-xs sm:text-sm font-medium mb-1.5 text-gray-700'>
              Full Name
            </label>
            <div className='relative'>
              <User size={16} className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 sm:w-[18px] sm:h-[18px]' />
              <input 
                className='w-full pl-10 pr-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-gray-300 rounded-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all' 
                type="text" 
                onChange={(e) => setName(e.target.value)} 
                value={name}
                placeholder='Enter your full name'
                required 
              />
            </div>
          </div>
        )}
        
        {/* Email Field */}
        <div className='mb-4'>
          <label className='block text-xs sm:text-sm font-medium mb-1.5 text-gray-700'>
            Email
          </label>
          <div className='relative'>
            <Mail size={16} className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 sm:w-[18px] sm:h-[18px]' />
            <input 
              className='w-full pl-10 pr-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-gray-300 rounded-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all' 
              type="email" 
              onChange={(e) => setEmail(e.target.value)} 
              value={email}
              placeholder='Enter your email'
              required 
            />
          </div>
        </div>
        
        {/* Password Field */}
        <div className='mb-4'>
          <label className='block text-xs sm:text-sm font-medium mb-1.5 text-gray-700'>
            Password
          </label>
          <div className='relative'>
            <Lock size={16} className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 sm:w-[18px] sm:h-[18px]' />
            <input 
              className='w-full pl-10 pr-10 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-gray-300 rounded-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all' 
              type={showPassword ? "text" : "password"} 
              onChange={(e) => setPassword(e.target.value)} 
              value={password}
              placeholder='Enter your password'
              required 
            />

            <button
              type='button'
              onClick={() => setShowPassword(!showPassword)}
              className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors'
            >
              {showPassword ? <EyeOff size={18} className='sm:w-5 sm:h-5' /> : <Eye size={18} className='sm:w-5 sm:h-5' />}
            </button>
          </div>
          
          {/* Forgot Password Link */}
          {state === 'Login' && (
            <p
              onClick={() => navigate("/email-verify")}
              className="text-primary text-xs sm:text-sm underline cursor-pointer text-right mt-2 hover:text-primary/80 transition-colors"
            >
              Forgot Password?
            </p>
          )}
        </div>
        
        {/* Submit Button */}
        <button 
          type='submit'
          disabled={loading}
          className={`w-full py-2.5 sm:py-3 rounded-md text-white text-sm sm:text-base font-medium transition-all ${
            loading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-primary hover:bg-primary/90 active:scale-[0.98]'
          }`}
        >
          {loading 
            ? (state === 'Sign Up' ? 'Creating Account...' : 'Logging in...') 
            : (state === 'Sign Up' ? 'Create Account' : 'Login')
          }
        </button>
        
        {/* Toggle State */}
        <div className='text-center mt-4'>
          {state === 'Sign Up' ? (
            <p className='text-xs sm:text-sm text-gray-600'>
              Already have an account?{' '}
              <span onClick={() => setState('Login')} className='text-primary font-medium underline cursor-pointer hover:text-primary/80 transition-colors'>
                Login here
              </span>
            </p>
          ) : (
            <p className='text-xs sm:text-sm text-gray-600'>
              Don't have an account?{' '}
              <span onClick={() => setState('Sign Up')} className='text-primary font-medium underline cursor-pointer hover:text-primary/80 transition-colors'>
                Sign up here
              </span>
            </p>
          )}
        </div>
        
      </form>
    </div>
  )
}

export default Login
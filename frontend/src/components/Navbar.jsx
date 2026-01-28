import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { NavLink, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const Navbar = () => {

  const navigate = useNavigate()
  const { token, setToken, userData } = useContext(AppContext)
  const [showMenu, setShowMenu] = useState(false)

  const logout = () => {
    setToken(false)
    localStorage.removeItem('token')
    navigate('/')
  }

  return (
    <div className='sticky top-0 z-40 bg-white flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400'>
      {/* Logo */}
      <img onClick={() => navigate('/')} className='w-28 sm:w-36 lg:w-44 cursor-pointer' src={assets.logo} alt="Logo" />

      {/* Desktop Navigation */}
      <ul className='hidden md:flex items-center gap-5 font-medium mt-1'>
        <NavLink to='/' className={({ isActive }) => isActive ? 'text-primary' : ''}>
            <li className='py-1 relative group'>
              HOME
              <span className='absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 bg-primary w-0 group-hover:w-3/5 transition-all duration-300'></span>
            </li>
        </NavLink>
        <NavLink to='/doctors' className={({ isActive }) => isActive ? 'text-primary' : ''}>
            <li className='py-1 relative group'>
              ALL DOCTORS
              <span className='absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 bg-primary w-0 group-hover:w-3/5 transition-all duration-300'></span>
            </li>
        </NavLink>
        <NavLink to='/about' className={({ isActive }) => isActive ? 'text-primary' : ''}>
            <li className='py-1 relative group'>
              ABOUT
              <span className='absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 bg-primary w-0 group-hover:w-3/5 transition-all duration-300'></span>
            </li>
        </NavLink>
        <NavLink to='/contact' className={({ isActive }) => isActive ? 'text-primary' : ''}>
            <li className='py-1 relative group'>
              CONTACT
              <span className='absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 bg-primary w-0 group-hover:w-3/5 transition-all duration-300'></span>
            </li>
        </NavLink>
      </ul>

      {/* Right Side - Auth & Menu */}

      <div className='flex items-center gap-4'>

        {/* Desktop Auth Buttons */}
        {token && userData ? (
          <div className='hidden md:flex items-center gap-4'>
            <img onClick={() => navigate('/my-profile')} className='w-8 h-8 rounded-full cursor-pointer hover:opacity-80 transition border-2 border-gray-200' src={userData.image}  alt="Profile" />
            <button onClick={logout} className='bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full font-medium transition shadow-sm cursor-pointer'>
              Logout
            </button>
          </div>
        ) : (
          <div className='hidden md:flex items-center gap-3'>
            <button onClick={() => navigate('/login')} className='bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-full font-medium transition shadow-sm'>
              Create Account
            </button>
          </div>
        )}

        {/* Mobile Menu Icon */}
        <img onClick={() => setShowMenu(true)} className='w-6 cursor-pointer md:hidden' src={assets.menu_icon} alt="Menu" />

        {/* -------- Mobile Menu -------- */}
        <div className={`${showMenu ? 'fixed inset-0' : 'hidden'} md:hidden z-50`}>
          
          {/* Backdrop */}
          <div className='fixed inset-0 bg-black/30 transition-opacity duration-300 z-40'onClick={() => setShowMenu(false)}></div>
          
          {/* Menu Panel */}
          <div className={`fixed top-0 right-0 h-full w-4/5 max-w-sm bg-white shadow-xl transform transition-transform duration-300 z-50 ${showMenu ? 'translate-x-0' : 'translate-x-full'}`}>
            
            {/* Header */}
            <div className='flex items-center justify-between px-5 py-6 border-b'>
              <img className='w-28 sm:w-36' src={assets.logo} alt="Logo" onClick={() => { setShowMenu(false); navigate('/'); }}/>
              <img className='w-6 cursor-pointer' onClick={() => setShowMenu(false)} src={assets.cross_icon} alt="Close" />
            </div>

            {/* Menu Items */}
            <div className='px-5 py-6'>
              <ul className='flex flex-col gap-1 mb-6'>
                <NavLink to='/' onClick={() => setShowMenu(false)}>
                  {({ isActive }) => (
                    <li className={`px-4 py-3 rounded-lg ${isActive ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}>
                      HOME
                    </li>
                  )}
                </NavLink>

                <NavLink to='/doctors' onClick={() => setShowMenu(false)}>
                  {({ isActive }) => (
                    <li className={`px-4 py-3 rounded-lg ${isActive ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}>
                      ALL DOCTORS
                    </li>
                  )}
                </NavLink>

                <NavLink to='/about' onClick={() => setShowMenu(false)}>
                  {({ isActive }) => (
                    <li className={`px-4 py-3 rounded-lg ${isActive ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}>
                      ABOUT
                    </li>
                  )}
                </NavLink>

                <NavLink to='/contact' onClick={() => setShowMenu(false)}>
                  {({ isActive }) => (
                    <li className={`px-4 py-3 rounded-lg ${isActive ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}>
                      CONTACT
                    </li>
                  )}
                </NavLink>
              </ul>

              {/* Mobile Auth Buttons */}
              {token && userData ? (
                <div className='mt-8 border-t pt-6'>
                  <div onClick={() => { setShowMenu(false); navigate('/my-profile'); }}className='flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 cursor-pointer mb-4'>
                    <img className='w-10 h-10 rounded-full border-2 border-gray-300' src={userData.image} alt="Profile" />
                    <div>
                      <p className='font-semibold'>{userData.name || 'My Profile'}</p>
                      <p className='text-xs text-gray-500'>View Profile</p>
                    </div>
                  </div>
                  <button onClick={() => { setShowMenu(false); logout(); }} className='w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-medium transition'>
                    Logout
                  </button>
                </div>
              ) : (
                <div className='mt-8 border-t pt-6 space-y-3'>
                  <button onClick={() => { setShowMenu(false); navigate('/login'); }}className='w-full bg-primary hover:bg-primary-dark text-white py-3 rounded-lg font-medium transition shadow-sm'>
                    Create Account
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Navbar
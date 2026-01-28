import React, { useContext, useEffect, useState } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { ArrowLeft, Edit2, User, Info, FileText, CheckCircle, Save, X, Lock, Camera, Users } from 'lucide-react'
import axios from 'axios'
import { toast } from 'react-toastify'

const DoctorsList = () => {
  const { doctors, aToken, getAllDoctors, changeAvailability, backendUrl } = useContext(AdminContext)
  const [selectedDoctorId, setSelectedDoctorId] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [editForm, setEditForm] = useState({})
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)

  const [doctorsLoading, setDoctorsLoading] = useState(true)

  const specialities = [
    'General physician',
    'Gynecologist',
    'Dermatologist',
    'Pediatricians',
    'Neurologist',
    'Gastroenterologist'
  ]

  useEffect(() => {
  const fetchData = async () => {
    if (aToken) {
      setDoctorsLoading(true);
      await getAllDoctors();
      setDoctorsLoading(false);
    }
   };
   fetchData();
  }, [aToken])

  const selectedDoctor = doctors.find(d => d._id === selectedDoctorId)

  const startEditing = () => {
    setEditForm({
      name: selectedDoctor.name,
      email: selectedDoctor.email,
      phone: selectedDoctor.phone,
      password: '',
      speciality: selectedDoctor.speciality,
      degree: selectedDoctor.degree,
      experience: selectedDoctor.experience,
      about: selectedDoctor.about,
      fees: selectedDoctor.fees,
      address: selectedDoctor.address ? { 
        line1: selectedDoctor.address.line1 || '',
        line2: selectedDoctor.address.line2 || ''
      } : { line1: '', line2: '' }
    })
    setImageFile(null)
    setImagePreview(null)
    setIsEditing(true)
  }

  const cancelEditing = () => {
    setIsEditing(false)
    setEditForm({})
    setImageFile(null)
    setImagePreview(null)
  }

  const handleChange = (field, value) => {
    setEditForm(prev => ({ ...prev, [field]: value }))
  }

  const handleAddressChange = (line, value) => {
    setEditForm(prev => ({
      ...prev,
      address: { ...prev.address, [line]: value }
    }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => setImagePreview(reader.result)
      reader.readAsDataURL(file)
    }
  }

  const saveChanges = async () => {
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('docId', selectedDoctorId)
      formData.append('name', editForm.name)
      formData.append('email', editForm.email)
      formData.append('phone', editForm.phone)
      formData.append('speciality', editForm.speciality)
      formData.append('degree', editForm.degree)
      formData.append('experience', editForm.experience)
      formData.append('about', editForm.about)
      formData.append('fees', editForm.fees)
      formData.append('address', JSON.stringify(editForm.address))

      if (editForm.password?.trim()) {
        formData.append('password', editForm.password)
      }

      if (imageFile) {
        formData.append('image', imageFile)
      }

      const { data } = await axios.post(
        backendUrl + '/api/admin/update-doctor',
        formData,
        { 
          headers: { 
            aToken,
            'Content-Type': 'multipart/form-data'
          } 
        }
      )

      if(data.success) {
        toast.success(data.message)
        setIsEditing(false)
        setImageFile(null)
        setImagePreview(null)
        await getAllDoctors()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
    }

  const toggleAvailability = async (doctorId, e) => {
    e.stopPropagation()
    try {
      await changeAvailability(doctorId)
      await getAllDoctors()
    } catch (error) {
      console.error('Error:', error)
    }
  }

  // Detail View
  if (selectedDoctorId && selectedDoctor) {
    const displayData = isEditing ? editForm : selectedDoctor

    return (
      <div className='w-full min-h-screen p-3 sm:p-5 md:p-6 lg:p-8 bg-gray-50'>
        <div className='max-w-6xl'>
          
          {/* Header */}
          <div className='flex items-center justify-between mb-4 sm:mb-6'>
            <button 
              onClick={() => {
                setSelectedDoctorId(null)
                setIsEditing(false)
                setImageFile(null)
                setImagePreview(null)
              }}
              className='flex items-center gap-2 px-3 sm:px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition font-medium text-sm sm:text-base'>
              <ArrowLeft className='w-4 h-4 sm:w-5 sm:h-5' />
              <span className='hidden sm:inline'>Back</span>
            </button>
            
            {!isEditing ? (
              <button 
                onClick={startEditing}
                className='flex items-center gap-2 px-3 sm:px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition font-medium text-sm sm:text-base'>
                <Edit2 className='w-4 h-4 sm:w-5 sm:h-5' />
                <span className='hidden sm:inline'>Edit Profile</span>
                <span className='sm:hidden'>Edit</span>
              </button>
            ) : (
              <div className='flex gap-2'>
                <button 
                  onClick={cancelEditing}
                  className='flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition font-medium text-sm sm:text-base'>
                  <X className='w-4 h-4 sm:w-5 sm:h-5' />
                  <span className='hidden sm:inline'>Cancel</span>
                </button>
                <button 
                  onClick={saveChanges}
                  disabled={loading}
                  className='flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-medium disabled:bg-blue-400 disabled:cursor-not-allowed text-sm sm:text-base'
                >
                  <Save className='w-4 h-4 sm:w-5 sm:h-5' />
                  {loading ? 'Saving...' : 'Save'}
                </button>
              </div>
            )}
          </div>

          {/* Doctor Info Card */}
          <div className='bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6 border border-blue-100'>
            <h3 className='text-base sm:text-lg font-bold text-gray-800 mb-4 flex items-center gap-2'>
              <User className='w-5 h-5 text-blue-600' />
              Doctor Information
            </h3>
            
            <div className='flex flex-col sm:flex-row items-center sm:items-start gap-4'>
              <div className='relative flex-shrink-0'>
                <img className='w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full border-4 border-white shadow-lg object-cover'
                  src={imagePreview || selectedDoctor.image}
                  alt={selectedDoctor.name} />
                {isEditing && (
                  <label className='absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white p-2 sm:p-2.5 rounded-full cursor-pointer shadow-lg transition'>
                    <Camera className='w-4 h-4 sm:w-5 sm:h-5' />
                    <input type='file' accept='image/*' onChange={handleImageChange} className='hidden' />
                  </label>
                )}
              </div>
              
              <div className='flex-1 w-full text-center sm:text-left'>
                {isEditing ? (
                  <input
                    type='text'
                    value={editForm.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder='Doctor Name'
                    className='w-full px-3 sm:px-4 py-2 text-lg sm:text-xl md:text-2xl font-bold text-gray-800 border border-gray-300 rounded-lg mb-3 focus:ring-2 focus:ring-blue-500 focus:outline-none'
                  />
                ) : (
                  <h2 className='text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-3'>{selectedDoctor.name}</h2>
                )}
                
                <div className='flex flex-wrap justify-center sm:justify-start gap-2'>
                  <span className='inline-flex items-center gap-1.5 bg-indigo-600 text-white text-xs sm:text-sm font-semibold px-3 py-1.5 rounded-full'>
                    <CheckCircle className='w-4 h-4' />
                    {displayData.speciality}
                  </span>
                  
                  <span className={`inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold px-3 py-1.5 rounded-full ${selectedDoctor.available ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                    {selectedDoctor.available ? 'Available' : 'Not Available'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className='bg-white rounded-xl border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6'>
            <h3 className='text-base sm:text-lg font-bold text-gray-800 mb-4 flex items-center gap-2'>
              <Info className='w-5 h-5 text-blue-600' />
              Complete Details
            </h3>
            
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6'>
              
              {/* Personal Information */}
              <div>
                <h4 className='text-sm sm:text-base font-semibold text-gray-700 mb-3 pb-2 border-b'>Personal Information</h4>
                <div className='space-y-3'>
                  
                  <div className='rounded-lg p-3 bg-gray-50 border border-gray-100'>
                    <label className='text-xs sm:text-sm text-gray-600 mb-1 block font-medium'>Email</label>
                    {isEditing ? (
                      <input
                        type='email'
                        value={editForm.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        className='w-full px-3 py-2 text-sm text-gray-900 font-medium border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white'
                      />
                    ) : (
                      <p className='text-sm text-gray-900 font-medium break-all'>{selectedDoctor.email}</p>
                    )}
                  </div>

                  {isEditing && (
                    <div className='rounded-lg p-3 bg-yellow-50 border border-yellow-200'>
                      <label className='text-xs sm:text-sm text-gray-600 mb-1 block font-medium flex items-center gap-1.5'>
                        <Lock className='w-4 h-4' />
                        New Password (Optional)
                      </label>
                      <input
                        type='password'
                        value={editForm.password}
                        onChange={(e) => handleChange('password', e.target.value)}
                        placeholder='Leave empty to keep current password'
                        className='w-full px-3 py-2 text-sm text-gray-900 font-medium border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white'
                      />
                      <p className='text-xs text-gray-500 mt-1'>Minimum 8 characters required</p>
                    </div>
                  )}
                  
                  <div className='rounded-lg p-3 bg-gray-50 border border-gray-100'>
                    <label className='text-xs sm:text-sm text-gray-600 mb-1 block font-medium'>Phone</label>
                    {isEditing ? (
                      <input
                        type='text'
                        value={editForm.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        className='w-full px-3 py-2 text-sm text-gray-900 font-medium border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white'
                      />
                    ) : (
                      <p className='text-sm text-gray-900 font-medium'>{selectedDoctor.phone}</p>
                    )}
                  </div>
                  
                  <div className='rounded-lg p-3 bg-gray-50 border border-gray-100'>
                    <label className='text-xs sm:text-sm text-gray-600 mb-1 block font-medium'>Address Line 1</label>
                    {isEditing ? (
                      <input
                        type='text'
                        value={editForm.address?.line1 || ''}
                        onChange={(e) => handleAddressChange('line1', e.target.value)}
                        className='w-full px-3 py-2 text-sm text-gray-900 font-medium border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white'
                      />
                    ) : (
                      <p className='text-sm text-gray-900 font-medium'>{selectedDoctor?.address?.line1 || 'Not provided'}</p>
                    )}
                  </div>
                  
                  <div className='rounded-lg p-3 bg-gray-50 border border-gray-100'>
                    <label className='text-xs sm:text-sm text-gray-600 mb-1 block font-medium'>Address Line 2</label>
                    {isEditing ? (
                      <input
                        type='text'
                        value={editForm.address?.line2 || ''}
                        onChange={(e) => handleAddressChange('line2', e.target.value)}
                        className='w-full px-3 py-2 text-sm text-gray-900 font-medium border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white'
                      />
                    ) : (
                      <p className='text-sm text-gray-900 font-medium'>{selectedDoctor?.address?.line2 || 'Not provided'}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Professional Information */}
              <div>
                <h4 className='text-sm sm:text-base font-semibold text-gray-700 mb-3 pb-2 border-b'>Professional Details</h4>
                <div className='space-y-3'>
                  
                  <div className='rounded-lg p-3 bg-indigo-50 border border-indigo-100'>
                    <label className='text-xs sm:text-sm text-gray-600 mb-1 block font-medium'>Speciality</label>
                    {isEditing ? (
                      <select
                        value={editForm.speciality}
                        onChange={(e) => handleChange('speciality', e.target.value)}
                        className='w-full px-3 py-2 text-sm text-gray-900 font-medium border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white'
                      >
                        <option value=''>Select Speciality</option>
                        {specialities.map((spec, idx) => (
                          <option key={idx} value={spec}>{spec}</option>
                        ))}
                      </select>
                    ) : (
                      <p className='text-sm text-gray-900 font-medium'>{selectedDoctor.speciality}</p>
                    )}
                  </div>
                  
                  <div className='rounded-lg p-3 bg-indigo-50 border border-indigo-100'>
                    <label className='text-xs sm:text-sm text-gray-600 mb-1 block font-medium'>Degree</label>
                    {isEditing ? (
                      <input
                        type='text'
                        value={editForm.degree}
                        onChange={(e) => handleChange('degree', e.target.value)}
                        className='w-full px-3 py-2 text-sm text-gray-900 font-medium border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white'
                      />
                    ) : (
                      <p className='text-sm text-gray-900 font-medium'>{selectedDoctor.degree}</p>
                    )}
                  </div>
                  
                  <div className='rounded-lg p-3 bg-indigo-50 border border-indigo-100'>
                    <label className='text-xs sm:text-sm text-gray-600 mb-1 block font-medium'>Experience</label>
                    {isEditing ? (
                      <input
                        type='text'
                        value={editForm.experience}
                        onChange={(e) => handleChange('experience', e.target.value)}
                        className='w-full px-3 py-2 text-sm text-gray-900 font-medium border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white'
                      />
                    ) : (
                      <p className='text-sm text-gray-900 font-medium'>{selectedDoctor.experience}</p>
                    )}
                  </div>
                  
                  <div className='rounded-lg p-3 bg-green-50 border border-green-100'>
                    <label className='text-xs sm:text-sm text-gray-600 mb-1 block font-medium'>Consultation Fees</label>
                    {isEditing ? (
                      <input
                        type='number'
                        value={editForm.fees}
                        onChange={(e) => handleChange('fees', e.target.value)}
                        className='w-full px-3 py-2 text-sm text-green-700 font-bold border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white'
                      />
                    ) : (
                      <p className='text-sm text-green-700 font-bold'>Rs. {selectedDoctor.fees}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          

          {/* About Section */}
          <div className='bg-white rounded-xl border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6'>
            <h3 className='text-base sm:text-lg font-bold text-gray-800 mb-3 flex items-center gap-2'>
              <FileText className='w-5 h-5 text-blue-600' />
              About Doctor
            </h3>
            {isEditing ? (
              <textarea
                value={editForm.about}
                onChange={(e) => handleChange('about', e.target.value)}
                rows={4}
                className='w-full px-3 sm:px-4 py-3 text-sm text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white'
              />
            ) : (
              <p className='text-sm text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-100'>
                {selectedDoctor.about}
              </p>
            )}
          </div>

          {/* Edit Button at Bottom - Mobile Only */}
          {!isEditing && (
            <div className='sm:hidden fixed bottom-6 right-6 z-10'>
              <button 
                onClick={startEditing}
                className='flex items-center justify-center w-14 h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg transition'
              >
                <Edit2 className='w-6 h-6' />
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  // List View
  return (
    <div className='p-3 sm:p-5 md:p-6 max-h-[90vh] overflow-y-auto'>
      
      {/* Header */}
      <div className="mb-4 sm:mb-6 lg:mb-8"> 
        <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 flex items-center gap-2">
        <Users className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-indigo-600" />
        All Doctors
      </h1>
      <p className="mt-1 sm:mt-2 text-xs sm:text-sm lg:text-base text-gray-600 ml-7 sm:ml-8 lg:ml-9">
       View and manage all registered doctors in the system
      </p>
    </div>
      

    {doctorsLoading ? (
    // Loading Skeleton
    <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4'>
      {[...Array(10)].map((_, i) => (
      <div key={i} className='border border-gray-200 rounded-xl overflow-hidden animate-pulse'>
        <div className='aspect-square w-full bg-gray-200'></div>
        <div className='p-2.5 sm:p-3 md:p-4'>
          <div className='h-3 sm:h-4 bg-gray-200 rounded w-3/4 mb-2'></div>
          <div className='h-3 bg-gray-200 rounded w-1/2 mb-2'></div>
          <div className='flex items-center gap-2 mt-2'>
            <div className='w-3.5 h-3.5 sm:w-4 sm:h-4 bg-gray-200 rounded'></div>
            <div className='h-3 bg-gray-200 rounded w-16'></div>
          </div>
        </div>
      </div>
      ))}
    </div>
    ) : (
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5  gap-3 sm:gap-4'>
        {doctors.map((item) => (
          <div 
            className='border border-indigo-200 rounded-xl overflow-hidden cursor-pointer group hover:shadow-lg transition-all duration-300' 
            key={item._id}
            onClick={() => setSelectedDoctorId(item._id)}
          >
            <div className='aspect-square w-full overflow-hidden bg-indigo-50'>
              <img 
                className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300' 
                src={item.image} 
                alt={item.name} 
              />
            </div>
            <div className='p-2.5 sm:p-3 md:p-4'>
              <p className='text-neutral-800 text-xs sm:text-sm md:text-base font-medium truncate'>{item.name}</p>
              <p className='text-zinc-600 text-xs sm:text-xs md:text-sm truncate mt-0.5'>{item.speciality}</p>
              <div className='mt-2 flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm'>
                <input 
                  onChange={(e) => toggleAvailability(item._id, e)} 
                  type="checkbox" 
                  checked={item.available}
                  onClick={(e) => e.stopPropagation()}
                  className='w-3.5 h-3.5 sm:w-4 sm:h-4 cursor-pointer'
                />
                <p>Available</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      )}
    </div>
  )
}

export default DoctorsList
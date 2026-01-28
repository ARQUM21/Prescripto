import React, { useContext, useState } from "react";
import { AdminContext } from "../../context/AdminContext";
import { toast } from 'react-toastify'
import axios from 'axios'
import { Plus, RotateCcw, Upload, UserPlus, Eye, EyeOff, Loader2, } from 'lucide-react'
import { AppContext } from "../../context/AppContext";

const AddDoctor = () => {
  const [docImg, setDocImg] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [experience, setExperience] = useState('1 Year')
  const [fees, setFees] = useState('')
  const [about, setAbout] = useState('')
  const [speciality, setSpeciality] = useState('General physician')
  const [degree, setDegree] = useState('')
  const [address1, setAddress1] = useState('')
  const [address2, setAddress2] = useState('')
  const [phone, setPhone] = useState()
  const [isLoading, setIsLoading] = useState(false)

  const { backendUrl, aToken } = useContext(AdminContext)
  const { currency } = useContext(AppContext)

  const onSubmitHandler = async (event) => {
    event.preventDefault()

    if (!docImg) return toast.error('Image Not Selected')

    setIsLoading(true)

    try {
      const formData = new FormData()
      formData.append('image', docImg)
      formData.append('name', name)
      formData.append('email', email)
      formData.append('password', password)
      formData.append('phone', phone)
      formData.append('experience', experience)
      formData.append('fees', Number(fees))
      formData.append('about', about)
      formData.append('speciality', speciality)
      formData.append('degree', degree)
      formData.append('address', JSON.stringify({line1: address1, line2: address2}))
      

      const { data } = await axios.post(backendUrl + '/api/admin/add-doctor', formData, {headers: {aToken}})
      
      if(data.success) {
        toast.success(data.message)
        handleReset()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setDocImg(false)
    setName('')
    setEmail('')
    setPassword('')
    setPhone('')
    setAddress1('')
    setAddress2('')
    setDegree('')
    setAbout('')
    setFees('')
    setExperience('1 Year')
    setSpeciality('General physician')
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-4 sm:py-6 lg:py-8 px-3 sm:px-6 lg:px-8">
      <div className="max-w-5xl">

        {/* Header */}
        <div className="mb-4 sm:mb-6 lg:mb-8"> 
          <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 flex items-center gap-2">
            <UserPlus className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-primary" />
            Add New Doctor
          </h1>
          <p className="mt-1 sm:mt-2 text-xs sm:text-sm lg:text-base text-gray-600 ml-7 sm:ml-8 lg:ml-9">
            Fill in the information below to add a new doctor to the system
          </p>
        </div>

        {/* Form Card */}
        <form onSubmit={onSubmitHandler} className="bg-white rounded-xl sm:rounded-2xl shadow-xl overflow-hidden">
          <div className="p-4 sm:p-6 lg:p-8 xl:p-10">
            
            {/* Image Upload Section */}
            <div className="mb-6 sm:mb-8 lg:mb-10">
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-3 sm:mb-4">
                Doctor Photo
              </label>
              <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                <label htmlFor="doc-img" className="cursor-pointer group">
                  <div className="relative w-28 h-28 sm:w-32 sm:h-32 lg:w-36 lg:h-36">
                    {docImg ? (
                      <img className="w-full h-full rounded-2xl object-cover border-4 border-primary shadow-lg" src={URL.createObjectURL(docImg)} alt="Doctor Preview" />
                    ) : (
                      <div className="w-full h-full rounded-2xl border-3 border-dashed border-gray-300 group-hover:border-primary bg-gray-50 group-hover:bg-primary/5 transition-all duration-300 flex flex-col items-center justify-center gap-2">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center transition-all">
                          <Upload className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
                        </div>
                        <p className="text-xs sm:text-sm font-medium text-gray-600 group-hover:text-primary transition-colors">
                          Upload Photo
                        </p>
                      </div>
                    )}
                  </div>
                </label>
                <input onChange={(e) => setDocImg(e.target.files[0])} type="file" id="doc-img" hidden accept="image/*"/>
                <div className="text-center sm:text-left">
                  <p className="text-sm sm:text-base font-semibold text-gray-800 mb-1">Upload doctor picture</p>
                  <p className="text-xs text-gray-500">JPG, PNG or JPEG</p>
                  <p className="text-xs text-gray-500">Maximum size: 2MB</p>
                  {docImg && (
                    <button type="button" onClick={() => setDocImg(false)} className="mt-2 text-xs sm:text-sm text-red-500 hover:text-red-700 font-medium flex items-center gap-1 mx-auto sm:mx-0">
                      <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4" />
                      Remove Image
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mb-6 sm:mb-8 lg:mb-10"></div>

            {/* Form Fields Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
              
              {/* Left Column */}
              <div className="space-y-4 sm:space-y-5 lg:space-y-6">
                {/* Doctor Name */}
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                    Doctor Name <span className="text-red-500">*</span>
                  </label>
                  <input 
                    onChange={(e) => setName(e.target.value)} 
                    value={name} 
                    className="w-full border-2 border-gray-200 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-gray-700 focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-20 transition-all outline-none" 
                    type="text" 
                    placeholder="Enter full name" 
                    required 
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input 
                    onChange={(e) => setEmail(e.target.value)} 
                    value={email} 
                    className="w-full border-2 border-gray-200 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-gray-700 focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-20 transition-all outline-none" 
                    type="email" 
                    placeholder="doctor@example.com" 
                    required 
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input 
                      onChange={(e) => setPassword(e.target.value)} 
                      value={password} 
                      className="w-full border-2 border-gray-200 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-gray-700 focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-20 transition-all outline-none pr-10"  
                      placeholder="Enter password" 
                      required
                      type={showPassword ? "text" : "password"} 
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors">
                      {showPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
                    </button>
                  </div>
                </div>

                {/* Experience */}
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                    Years of Experience <span className="text-red-500">*</span>
                  </label>
                  <select 
                    onChange={(e) => setExperience(e.target.value)} 
                    value={experience} 
                    className="w-full border-2 border-gray-200 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-gray-700 focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-20 transition-all outline-none bg-white cursor-pointer"
                  >
                    <option value="1 Year">1 Year</option>
                    <option value="2 Years">2 Years</option>
                    <option value="3 Years">3 Years</option>
                    <option value="4 Years">4 Years</option>
                    <option value="5 Years">5 Years</option>
                    <option value="6 Years">6 Years</option>
                    <option value="7 Years">7 Years</option>
                    <option value="8 Years">8 Years</option>
                    <option value="9 Years">9 Years</option>
                    <option value="10 Years">10 Years</option>
                  </select>
                </div>

                {/* Fees */}
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                    Consultation Fees <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 sm:left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium text-sm sm:text-base  ">
                      {currency} 
                    </span>
                    <input 
                      onChange={(e) => setFees(e.target.value)} 
                      value={fees} 
                      className="w-full border-2 border-gray-200 rounded-lg pl-7  sm:pl-8 pr-3 sm:pr-4 py-2 sm:py-3 text-sm sm:text-base text-gray-700 focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-20 transition-all outline-none" 
                      type="number" 
                      placeholder="0.00" 
                      required 
                    />
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4 sm:space-y-5 lg:space-y-6">
                {/* Speciality */}
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                    Speciality <span className="text-red-500">*</span>
                  </label>
                  <select 
                    onChange={(e) => setSpeciality(e.target.value)} 
                    value={speciality} 
                    className="w-full border-2 border-gray-200 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-gray-700 focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-20 transition-all outline-none bg-white cursor-pointer"
                  >
                    <option value="General physician">General Physician</option>
                    <option value="Gynecologist">Gynecologist</option>
                    <option value="Dermatologist">Dermatologist</option>
                    <option value="Pediatricians">Pediatricians</option>
                    <option value="Neurologist">Neurologist</option>
                    <option value="Gastroenterologist">Gastroenterologist</option>
                  </select>
                </div>

                {/* Education */}
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                    Education / Degree <span className="text-red-500">*</span>
                  </label>
                  <input 
                    onChange={(e) => setDegree(e.target.value)} 
                    value={degree} 
                    className="w-full border-2 border-gray-200 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-gray-700 focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-20 transition-all outline-none" 
                    type="text" 
                    placeholder="e.g., MBBS, MD" 
                    required 
                  />
                </div>

                {/* Address */}
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                    Clinic Address <span className="text-red-500">*</span>
                  </label>
                  <div className="space-y-2 sm:space-y-3">
                    <input 
                      onChange={(e) => setAddress1(e.target.value)} 
                      value={address1} 
                      className="w-full border-2 border-gray-200 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-gray-700 focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-20 transition-all outline-none" 
                      type="text" 
                      placeholder="Street address" 
                      required 
                    />
                    <input 
                      onChange={(e) => setAddress2(e.target.value)} 
                      value={address2} 
                      className="w-full border-2 border-gray-200 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-gray-700 focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-20 transition-all outline-none" 
                      type="text" 
                      placeholder="City, State, ZIP" 
                      required 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input 
                    onChange={(e) => setPhone(e.target.value)} 
                    value={phone} 
                    className="w-full border-2 border-gray-200 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-gray-700 focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-20 transition-all outline-none" 
                    type="number"
                    placeholder="03XX-XXXXXXX"
                    required 
                  />
                </div>

              </div>
            </div>

            {/* About Doctor - Full Width */}
            <div className="mt-4 sm:mt-6 lg:mt-8">
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                About Doctor <span className="text-red-500">*</span>
              </label>
              <textarea 
                onChange={(e) => setAbout(e.target.value)} 
                value={about} 
                className="w-full border-2 border-gray-200 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-gray-700 focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-20 transition-all outline-none resize-none"
                placeholder="Write a brief description about the doctor's expertise, achievements, and approach to patient care..."
                rows={5}
                required
              />
              <p className="text-xs text-gray-500 mt-1.5 sm:mt-2">Minimum 50 characters recommended</p>
            </div>

            {/* Submit Button */}
            <div className="mt-6 sm:mt-8 lg:mt-10 flex flex-col sm:flex-row gap-2 sm:gap-3 lg:gap-4">
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full sm:w-auto font-semibold px-6 sm:px-8 py-2.5 sm:py-3.5 rounded-lg transition-all duration-300 text-sm sm:text-base ${
                  isLoading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                } text-white`}
              >
                <span className="flex items-center justify-center gap-2">
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                      Add Doctor
                    </>
                  )}
                </span>
              </button>

              <button 
                type="button" 
                onClick={handleReset}
                disabled={isLoading}
                className={`w-full sm:w-auto font-semibold px-6 sm:px-8 py-2.5 sm:py-3.5 rounded-lg transition-all duration-300 text-sm sm:text-base ${
                  isLoading 
                    ? 'bg-gray-200 cursor-not-allowed text-gray-400' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                <span className="flex items-center justify-center gap-2">
                  <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
                  Reset Form
                </span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDoctor;
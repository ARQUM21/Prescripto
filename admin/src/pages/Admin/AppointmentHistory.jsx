import React, { useContext, useEffect, useState, useMemo } from 'react';
import { AdminContext } from '../../context/AdminContext';
import { AppContext } from '../../context/AppContext';
import { Search, X, ArrowLeft, FileText, Calendar, DollarSign, Clock, User, Stethoscope, Thermometer, Pill, Clipboard, Activity, CheckCircle2, AlertCircle, Trash2 } from 'lucide-react';

const AppointmentHistory = () => {
  const { aToken, membersHistory, getAppointmentsHistory, deleteAppointmentHistory } = useContext(AdminContext);
  const { calculateAge, slotDateFormat, currency } = useContext(AppContext);
  
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
  const fetchData = async () => {
    if (aToken) {
      setLoading(true);
      await getAppointmentsHistory();
      setLoading(false);
    }
  };
  fetchData();
}, [aToken]);

  // Filtered History - Only by Patient ID
  const filteredHistory = useMemo(() => {
    let result = [...membersHistory];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(item => 
        item.userData.patientId?.toLowerCase().includes(query)
      );
    }

    return result.reverse();
  }, [membersHistory, searchQuery]);

  const handleViewDetails = (item) => {
    setSelectedAppointment(item);
    setShowDetail(true);
  };

  const handleBack = () => {
    setShowDetail(false);
    setSelectedAppointment(null);
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (selectedAppointment && selectedAppointment._id) {
      await deleteAppointmentHistory(selectedAppointment._id);
      setShowDeleteModal(false);
      handleBack();
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
  };

  // Detail View
  if (showDetail && selectedAppointment) {
    return (
      <div className="w-full p-3 sm:p-5 md:p-6 lg:p-8">
        <div className="max-w-5xl">
          
          {/* Header */}
          <div className="flex items-center justify-between gap-2 sm:gap-4 mb-5 sm:mb-6">
            <button 
              onClick={handleBack}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition text-sm sm:text-base font-medium flex-shrink-0"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Back to History</span>
              <span className="sm:hidden">Back</span>
            </button>
          </div>

          {/* Patient Info Card */}
          <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6 border border-blue-100 shadow-sm">
            <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              Patient Information
            </h3>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
              <img className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-white shadow-lg" src={selectedAppointment.userData.image} alt=""/>
              <div className="flex-1 w-full">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">{selectedAppointment.userData.name}</h2>
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="inline-flex items-center gap-1.5 bg-blue-600 text-white text-xs sm:text-sm font-semibold px-3 py-1 rounded-full">
                    <User className="w-3 h-3 sm:w-4 sm:h-4" />
                    {selectedAppointment.userData.patientId}
                  </span>
                  <span className="inline-flex items-center gap-1.5 bg-white text-gray-700 text-xs sm:text-sm px-3 py-1 rounded-full border border-gray-200">
                    Age: {calculateAge(selectedAppointment.userData.dob)} years
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-gray-600">
                  <p className="flex items-center gap-2">
                    <span className="font-medium">Email:</span> {selectedAppointment.userData.email}
                  </p>
                  {selectedAppointment.userData.phone && (
                    <p className="flex items-center gap-2">
                      <span className="font-medium">Phone:</span> {selectedAppointment.userData.phone}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Doctor Info Card */}
          <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6 border border-green-100 shadow-sm">
            <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-green-600" />
              Doctor Information
            </h3>
            <div className="flex items-start gap-4">
              <img className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-4 border-white shadow-lg bg-gray-200" src={selectedAppointment.docData.image} alt=""/>
              <div className="flex-1">
                <p className="text-lg sm:text-xl font-bold text-gray-800 mb-2">{selectedAppointment.docData.name}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-gray-600">
                  <p className="flex items-center gap-2">
                    <span className="font-medium">Specialty:</span> {selectedAppointment.docData.speciality}
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="font-medium">Degree:</span> {selectedAppointment.docData.degree}
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="font-medium">Experience:</span> {selectedAppointment.docData.experience}
                  </p>
                  {selectedAppointment.docData.email && (
                    <p className="flex items-center gap-2">
                      <span className="font-medium">Email:</span> {selectedAppointment.docData.email}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Appointment Details */}
          <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              Appointment Details
            </h3>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-blue-50 rounded-lg p-3 sm:p-4 border border-blue-100">
                <p className="text-xs sm:text-sm text-gray-600 mb-1 flex items-center gap-1">
                  <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                  Date
                </p>
                <p className="text-sm sm:text-base font-semibold text-gray-800">{slotDateFormat(selectedAppointment.slotDate)}</p>
              </div>
              
              <div className="bg-purple-50 rounded-lg p-3 sm:p-4 border border-purple-100">
                <p className="text-xs sm:text-sm text-gray-600 mb-1 flex items-center gap-1">
                  <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                  Time
                </p>
                <p className="text-sm sm:text-base font-semibold text-gray-800">{selectedAppointment.slotTime}</p>
              </div>
              
              <div className="bg-green-50 rounded-lg p-3 sm:p-4 border border-green-100">
                <p className="text-xs sm:text-sm text-gray-600 mb-1 flex items-center gap-1">
                  <DollarSign className="w-3 h-3 sm:w-4 sm:h-4" />
                  Fees
                </p>
                <p className="text-sm sm:text-base font-semibold text-gray-800">{currency} {selectedAppointment.amount}</p>
              </div>
              
              <div className="bg-emerald-50 rounded-lg p-3 sm:p-4 border border-emerald-100">
                <p className="text-xs sm:text-sm text-gray-600 mb-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4" />
                  Status
                </p>
                <p className="text-sm sm:text-base font-semibold text-green-600">Completed</p>
              </div>
            </div>

            {/* Timeline */}
            {selectedAppointment.createdAt && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="text-sm sm:text-base font-semibold text-gray-700 mb-3">Prescription Timeline</h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-gray-700">Created</p>
                      <p className="text-xs text-gray-500">{new Date(selectedAppointment.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Medical Details */}
          <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 flex items-center gap-2">
                <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                Medical Details
              </h3>
            </div>
            
            <div className="space-y-5 sm:space-y-6">
              
              {/* Diagnosis */}
              <div className="border-l-4 border-blue-600 pl-4">
                <div className="flex items-center gap-2 mb-2">
                  <Stethoscope className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  <label className="text-sm sm:text-base font-semibold text-gray-700">Diagnosis</label>
                </div>
                <p className="p-2 sm:p-3 bg-blue-50 rounded-lg border border-blue-200 text-sm sm:text-base text-gray-800">
                  {selectedAppointment.diagnosis || 'Not specified'}
                </p>
              </div>

              {/* Symptoms */}
              {selectedAppointment.symptoms && (
                <div className="border-l-4 border-orange-500 pl-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Thermometer className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
                    <label className="text-sm sm:text-base font-semibold text-gray-700">Symptoms</label>
                  </div>
                  <p className="p-2 sm:p-3 bg-orange-50 rounded-lg border border-orange-200 text-sm sm:text-base text-gray-800 whitespace-pre-line">
                    {selectedAppointment.symptoms}
                  </p>
                </div>
              )}

              {/* Medicines */}
              {selectedAppointment.medicines && (
                <div className="border-l-4 border-green-600 pl-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Pill className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                    <label className="text-sm sm:text-base font-semibold text-gray-700">Prescribed Medicines</label>
                  </div>
                  <p className="p-2 sm:p-3 bg-green-50 rounded-lg border border-green-200 text-sm sm:text-base text-gray-800 whitespace-pre-line">
                    {selectedAppointment.medicines}
                  </p>
                </div>
              )}

              {/* Instructions */}
              {selectedAppointment.instructions && (
                <div className="border-l-4 border-purple-600 pl-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clipboard className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                    <label className="text-sm sm:text-base font-semibold text-gray-700">Patient Instructions</label>
                  </div>
                  <p className="p-2 sm:p-3 bg-purple-50 rounded-lg border border-purple-200 text-sm sm:text-base text-gray-800 whitespace-pre-line">
                    {selectedAppointment.instructions}
                  </p>
                </div>
              )}

              {/* Lab Tests */}
              {selectedAppointment.labTests && (
                <div className="border-l-4 border-red-500 pl-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
                    <label className="text-sm sm:text-base font-semibold text-gray-700">Lab Tests</label>
                  </div>
                  <p className="p-2 sm:p-3 bg-red-50 rounded-lg border border-red-200 text-sm sm:text-base text-gray-800">
                    {selectedAppointment.labTests}
                  </p>
                </div>
              )}

              {/* Next Visit */}
              {selectedAppointment.nextVisit && (
                <div className="border-l-4 border-yellow-500 pl-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
                    <label className="text-sm sm:text-base font-semibold text-gray-700">Follow-up Visit</label>
                  </div>
                  <p className="p-2 sm:p-3 bg-yellow-50 rounded-lg border border-yellow-200 text-sm sm:text-base text-gray-800">
                    {selectedAppointment.nextVisit}
                  </p>
                </div>
              )}

              {/* Documentation */}
              {selectedAppointment.documentation && (
                <div className="border-l-4 border-indigo-600 pl-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
                    <label className="text-sm sm:text-base font-semibold text-gray-700">Documentation</label>
                  </div>
                  <p className="p-2 sm:p-3 bg-indigo-50 rounded-lg border border-indigo-200 text-sm sm:text-base text-gray-800">
                    {selectedAppointment.documentation}
                  </p>
                </div>
              )}
            </div>

            {/* Delete Button */}
            <div className="mt-6 sm:mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={handleDeleteClick}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold text-sm sm:text-base"
              >
                <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                Delete Record
              </button>
            </div>
          </div>
        </div>

        {/* Delete Confirmation Modal - FULLY RESPONSIVE */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4">
            <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 max-w-xs sm:max-w-md w-full mx-auto">
              <div className="text-center mb-3 sm:mb-4">
                <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-red-100 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                  <AlertCircle className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" />
                </div>
                <h3 className="text-base sm:text-xl font-bold mb-2 text-gray-800">Delete Appointment Record?</h3>
                <p className="text-xs sm:text-base text-gray-600">
                  Are you sure you want to delete this appointment record? This action cannot be undone.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <button
                  onClick={cancelDelete}
                  className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium text-gray-700 text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium text-sm sm:text-base"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // List View
  return (
    <div className="w-full p-3 sm:p-5 md:p-6 lg:p-8">
      <div className="max-w-7xl">
        
        {/* Header */}
        <div className="mb-5 sm:mb-6">
          <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 flex items-center gap-2">
            <FileText className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 text-blue-600" />
            Appointment History
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-gray-600 mt-1 ml-6 sm:ml-9">View and manage completed appointments</p>
        </div>

        {/* Search Bar Only */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-3 sm:p-4 mb-4 sm:mb-6">
          <div className="relative">
            <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Patient ID..."
              className="w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Stats Summary */}
        <div className='flex flex-wrap gap-2 sm:gap-3 md:gap-4 mb-4 text-[10px] sm:text-xs md:text-sm'>
          <span className='px-2 sm:px-3 py-1 bg-blue-50 text-blue-700 rounded-full whitespace-nowrap'>
            Total: {membersHistory.length}
          </span>
          <span className='px-2 sm:px-3 py-1 bg-purple-50 text-purple-700 rounded-full whitespace-nowrap'>
            Showing: {filteredHistory.length}
          </span>
        </div>

        {/* History Table - WITHOUT FEES COLUMN */}
        <div className='bg-white border rounded-lg text-xs sm:text-sm max-h-[70vh] sm:max-h-[80vh] min-h-[40vh] sm:min-h-[50vh] overflow-y-auto overflow-x-auto'>

          {/* Desktop Header - FEES REMOVED */}
          <div className='hidden lg:grid grid-cols-[0.5fr_1.5fr_0.5fr_1fr_1fr_1fr_0.5fr] gap-1 py-3 px-4 sm:px-6 border-b bg-gray-50 sticky top-0 z-10'>
            <p className='font-medium'>#</p>
            <p className='font-medium'>Patient</p>
            <p className='font-medium'>Patient ID</p>
            <p className='font-medium'>Diagnosis</p>
            <p className='font-medium'>Date & Time</p>
            <p className='font-medium'>Doctor</p>
            <p className='font-medium'>Action</p>
          </div>

          {loading ? (

          // Loading Skeleton
         <>
        {/* Mobile Skeleton */}
    <div className='lg:hidden'>
      {[...Array(5)].map((_, i) => (
        <div key={i} className='p-3 sm:p-4 border-b animate-pulse'>
          <div className='flex items-start gap-3 mb-3'>
            <div className='w-12 h-12 sm:w-14 sm:h-14 bg-gray-200 rounded-full'></div>
            <div className='flex-1'>
              <div className='h-4 bg-gray-200 rounded w-3/4 mb-2'></div>
              <div className='h-3 bg-gray-200 rounded w-1/2 mb-1'></div>
              <div className='h-3 bg-gray-200 rounded w-2/3'></div>
            </div>
          </div>
          <div className='h-6 bg-gray-200 rounded w-24 mb-2'></div>
          <div className='flex items-center justify-between'>
            <div className='flex gap-2 items-center'>
              <div className='w-8 h-8 bg-gray-200 rounded-full'></div>
              <div className='h-3 bg-gray-200 rounded w-20'></div>
            </div>
            <div className='h-4 bg-gray-200 rounded w-20'></div>
          </div>
        </div>
      ))}
    </div>

    {/* Desktop Skeleton */}
    <div className='hidden lg:block'>
      {[...Array(8)].map((_, i) => (
        <div key={i} className='grid grid-cols-[0.5fr_1.5fr_0.5fr_1fr_1fr_1fr_0.5fr] gap-1 py-4 px-6 border-b animate-pulse'>
          <div className='h-4 bg-gray-200 rounded w-6'></div>
          <div className='flex items-center gap-2'>
            <div className='w-10 h-10 bg-gray-200 rounded-full'></div>
            <div className='h-4 bg-gray-200 rounded w-32'></div>
          </div>
          <div className='h-4 bg-gray-200 rounded w-20'></div>
          <div className='h-4 bg-gray-200 rounded w-32'></div>
          <div className='h-4 bg-gray-200 rounded w-36'></div>
          <div className='flex items-center gap-2'>
            <div className='w-8 h-8 bg-gray-200 rounded-full'></div>
            <div className='h-4 bg-gray-200 rounded w-24'></div>
          </div>
          <div className='h-4 bg-gray-200 rounded w-20'></div>
        </div>
      ))}
    </div>
  </>
  ) : filteredHistory.length === 0 ? (
  // Empty state (jo pehle se hai)
            <div className='py-12 sm:py-16 text-center px-4'>
              <div className='mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3 sm:mb-4'>
                <Search className='w-6 h-6 sm:w-8 sm:h-8 text-gray-400' />
              </div>
              <h3 className='text-base sm:text-lg font-medium text-gray-700 mb-2'>
                No records found
              </h3>
              <p className='text-xs sm:text-sm text-gray-500'>
                {searchQuery ? 'Try adjusting your search' : 'No appointment history available'}
              </p>

              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className='mt-3 sm:mt-4 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-blue-600 hover:text-blue-800 font-medium'>
                  Clear search
                </button>
              )}
            </div>
          ) : (
            filteredHistory.map((item, index) => (
              <div
                key={item._id || index}
                className='flex flex-col lg:grid lg:grid-cols-[0.5fr_1.5fr_0.5fr_1fr_1fr_1fr_0.5fr] gap-2 lg:gap-1 items-start lg:items-center text-gray-500 py-3 sm:py-4 px-3 sm:px-4 lg:px-6 border-b hover:bg-gray-50'
              >

                {/* Mobile Card - FEES REMOVED */}
                <div className='lg:hidden w-full'>
                  <div className='flex items-start gap-3 mb-3'>
                    <img className='w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover' src={item.userData.image} alt='' />

                    <div className='flex-1'>
                      <p className='font-medium text-gray-800 text-sm sm:text-base'>
                        {item.userData.name}
                      </p>

                      <p className='text-xs text-gray-500'>
                        ID: {item.userData.patientId}
                      </p>

                      <p className='text-xs text-gray-500 mt-1'>
                        {slotDateFormat(item.slotDate)} • {item.slotTime}
                      </p>
                    </div>
                  </div>

                  {/* Diagnosis */}
                  <div className="inline-flex items-center bg-purple-100 text-purple-700 text-xs px-2 py-1 mb-2 rounded-md">
                    {item.diagnosis || 'N/A'}
                  </div>

                  {/* Doctor & Action Row */}
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                      <img className='w-8 h-8 rounded-full bg-gray-200' src={item.docData.image} alt='' />
                      <div>
                        <p className='text-xs font-medium text-gray-700'>{item.docData.name}</p>
                        <p className='text-[10px] text-gray-500'>{item.docData.speciality}</p>
                      </div>
                    </div>

                    <button onClick={() => handleViewDetails(item)} className='text-xs font-medium text-blue-600 hover:text-blue-800' >
                      View Details
                    </button>
                  </div>
                </div>

                {/* Desktop Grid - FEES REMOVED */}
                <p className='hidden lg:block'>{index + 1}</p>

                <div className='hidden lg:flex items-center gap-2'>
                  <img className='w-8 sm:w-9 md:w-10 h-8 sm:h-9 md:h-10 rounded-full object-cover' src={item.userData.image} alt=''/>
                  <p className='truncate'>{item.userData.name}</p>
                </div>

                <p className='hidden lg:block truncate'>{item.userData.patientId}</p>

                <div className='hidden lg:block'>
                  <span className="inline-flex items-center bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-md whitespace-nowrap max-w-none sm:max-w-[180px] sm:whitespace-normal sm:break-words">
                  {item.diagnosis || 'N/A'}
                  </span>
                </div>

                <p className='hidden lg:block text-xs xl:text-sm'>
                  {slotDateFormat(item.slotDate)}, {item.slotTime}
                </p>

                <div className='hidden lg:flex items-center gap-2'>
                  <img className='w-8 h-8 rounded-full bg-gray-200' src={item.docData.image} alt='' />
                  <div>
                    <p className='font-medium text-sm truncate'>{item.docData.name}</p>
                    <p className='text-xs text-gray-400 truncate'>{item.docData.speciality}</p>
                  </div>
                </div>

                <p onClick={() => handleViewDetails(item)} className='hidden lg:block text-blue-600 cursor-pointer hover:text-blue-800 font-medium'>
                  View Details
                </p>

              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};

export default AppointmentHistory;
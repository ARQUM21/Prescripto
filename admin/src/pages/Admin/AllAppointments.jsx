import React, { useContext, useEffect, useState, useMemo } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'
import { Search, X, ChevronDown, ChevronUp, SlidersHorizontal, FileText } from 'lucide-react'

const AllAppointments = () => {

  const { aToken, appointments, getAllAppointments, cancelAppointment } = useContext(AdminContext)
  const { calculateAge, slotDateFormat, currency } = useContext(AppContext)

  // Filter States
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState({
    status: 'all',
    dateRange: 'all',
  })

  useEffect(() => {
  const fetchData = async () => {
    if (aToken) {
      setIsLoading(true);
      await getAllAppointments();
      setIsLoading(false);
    }
    };
    fetchData();
  }, [aToken])

  // Handle Cancel with Refresh
  const handleCancelAppointment = async (appointmentId) => {
    await cancelAppointment(appointmentId);
    getAllAppointments(); 
  };


  // Filtered Appointments
  const filteredAppointments = useMemo(() => {
    let result = [...appointments];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(item => 
        item.userData.patientId?.toLowerCase().includes(query)
      );
    }

    if (filters.status !== 'all') {
      result = result.filter(item => {
        if (filters.status === 'pending') return !item.isCompleted && !item.cancelled;
        if (filters.status === 'completed') return item.isCompleted;
        if (filters.status === 'cancelled') return item.cancelled;
        return true;
      });
    }

    if (filters.dateRange !== 'all') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      result = result.filter(item => {
        const [day, month, year] = item.slotDate.split('_').map(Number);
        const appointmentDate = new Date(year, month - 1, day);
        appointmentDate.setHours(0, 0, 0, 0);
        
        const daysDiff = Math.floor((appointmentDate - today) / (1000 * 60 * 60 * 24));
        
        if (filters.dateRange === 'today') return daysDiff === 0;
        if (filters.dateRange === 'tomorrow') return daysDiff === 1;
        if (filters.dateRange === 'week') return daysDiff >= -7 && daysDiff <= 0;
        if (filters.dateRange === '15days') return daysDiff >= -15 && daysDiff <= 0;
        if (filters.dateRange === 'month') return daysDiff >= -30 && daysDiff <= 0;
        
        return true;
      });
    }

    return result;
  }, [appointments, searchQuery, filters]);

  const clearFilters = () => {
    setSearchQuery('');
    setFilters({
      status: 'all',
      dateRange: 'all',
    });
  };

  return (
    <div className='w-full p-3 sm:p-5 md:p-6 lg:p-8'>
      <div className='max-w-6xl'>
        
        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-4'>
          <div>
            <h1 className='text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 flex items-center gap-2'>
              <FileText className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 text-blue-600" /> All Appointments
            </h1>
            <p className='text-xs sm:text-sm md:text-base text-gray-600 mt-1 ml-6 sm:ml-9'>Monitor and manage all system appointments</p>
          </div>
          
          <button onClick={() => setShowFilters(!showFilters)} className='flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm'>
            <SlidersHorizontal className='w-4 h-4' />
            Filters
            {showFilters ? <ChevronUp className='w-4 h-4' /> : <ChevronDown className='w-4 h-4' />}
          </button>
        </div>

        {/* Search Bar */}
        <div className='bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 mb-4 sm:mb-6'>
          <div className='relative'>
            <Search className='absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5' />
            <input
              type='text'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder='Search by Patient ID...'
              className='w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className='absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600'>
                <X className='w-4 h-4 sm:w-5 sm:h-5' />
              </button>
            )}
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className='mt-4 sm:mt-6 p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200'>
              <div className='flex justify-between items-center mb-3 sm:mb-4'>
                <h3 className='font-semibold text-gray-700 text-sm sm:text-base'>Filter Appointments</h3>
                <button onClick={clearFilters} className='text-xs sm:text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1'>
                  <X className='w-3 h-3 sm:w-4 sm:h-4' />
                  Clear all
                </button>
              </div>
              
              <div className='flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-3 sm:space-y-0'>
                
                {/* Status Filter */}
                <div className='flex-1'>
                  <label className='block text-xs sm:text-sm font-medium text-gray-700 mb-1'>Status</label>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters({...filters, status: e.target.value})}
                    className='w-full border border-gray-300 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                {/* Date Range Filter */}
                <div className='flex-1'>
                  <label className='block text-xs sm:text-sm font-medium text-gray-700 mb-1'>Date Range</label>
                  <select
                    value={filters.dateRange}
                    onChange={(e) => setFilters({...filters, dateRange: e.target.value})}
                    className='w-full border border-gray-300 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
                  >
                    <option value="all">All Dates</option>
                    <option value="today">Today</option>
                    <option value="tomorrow">Tomorrow</option>
                    <option value="week">Last 7 Days</option>
                    <option value="15days">Last 15 Days</option>
                    <option value="month">Last 30 Days</option>
                  </select>
                </div>

              </div>

              {/* Active Filters Badges */}
              <div className='flex flex-wrap gap-2 mt-3 sm:mt-4'>
                {searchQuery && (
                  <span className='inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-[10px] sm:text-xs px-2 sm:px-3 py-1 rounded-full'>
                    Search: "{searchQuery}"
                    <button onClick={() => setSearchQuery('')} className='ml-1 hover:text-blue-900'>
                      <X className='w-2.5 h-2.5 sm:w-3 sm:h-3' />
                    </button>
                  </span>
                )}
                
                {filters.status !== 'all' && (
                  <span className='inline-flex items-center gap-1 bg-green-100 text-green-800 text-[10px] sm:text-xs px-2 sm:px-3 py-1 rounded-full'>
                    Status: {filters.status}
                    <button onClick={() => setFilters({...filters, status: 'all'})} className='ml-1 hover:text-green-900'>
                      <X className='w-2.5 h-2.5 sm:w-3 sm:h-3' />
                    </button>
                  </span>
                )}
                
                {filters.dateRange !== 'all' && (
                  <span className='inline-flex items-center gap-1 bg-purple-100 text-purple-800 text-[10px] sm:text-xs px-2 sm:px-3 py-1 rounded-full'>
                    Date: {filters.dateRange === 'today' ? 'Today' : 
                           filters.dateRange === 'tomorrow' ? 'Tomorrow' :
                           filters.dateRange === 'week' ? 'Last 7 Days' :
                           filters.dateRange === '15days' ? 'Last 15 Days' :
                           filters.dateRange === 'month' ? 'Last 30 Days' : filters.dateRange}
                    <button onClick={() => setFilters({...filters, dateRange: 'all'})} className='ml-1 hover:text-purple-900'>
                      <X className='w-2.5 h-2.5 sm:w-3 sm:h-3' />
                    </button>
                  </span>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Stats Summary */}
        <div className='flex flex-wrap gap-2 sm:gap-3 md:gap-4 mb-4 text-[10px] sm:text-xs md:text-sm'>
          <span className='px-2 sm:px-3 py-1 bg-blue-50 text-blue-700 rounded-full whitespace-nowrap'>
            Total: {appointments.length}
          </span>
          <span className='px-2 sm:px-3 py-1 bg-yellow-50 text-yellow-700 rounded-full whitespace-nowrap'>
            Pending: {appointments.filter(a => !a.isCompleted && !a.cancelled).length}
          </span>
          <span className='px-2 sm:px-3 py-1 bg-green-50 text-green-700 rounded-full whitespace-nowrap'>
            Completed: {appointments.filter(a => a.isCompleted).length}
          </span>
          <span className='px-2 sm:px-3 py-1 bg-red-50 text-red-700 rounded-full whitespace-nowrap'>
            Cancelled: {appointments.filter(a => a.cancelled).length}
          </span>
          <span className='px-2 sm:px-3 py-1 bg-gray-100 text-gray-700 rounded-full whitespace-nowrap'>
            Showing: {filteredAppointments.length}
          </span>
        </div>

        {/* Appointments Table */}
        <div className='bg-white border rounded-lg text-xs sm:text-sm max-h-[70vh] sm:max-h-[80vh] min-h-[40vh] sm:min-h-[60vh] overflow-y-auto overflow-x-auto'>

          <div className='hidden lg:grid grid-cols-[0.5fr_2fr_1fr_0.5fr_1.5fr_1.5fr_1fr_1fr] gap-1 py-3 px-4 sm:px-6 border-b bg-gray-50 sticky top-0 z-10'>
            <p className='font-medium'>#</p>
            <p className='font-medium'>Patient</p>
            <p className='font-medium'>Patient ID</p>
            <p className='font-medium'>Age</p>
            <p className='font-medium'>Date & Time</p>
            <p className='font-medium'>Doctor</p>
            <p className='font-medium'>Fees</p>
            <p className='font-medium'>Action</p>
          </div>

          {isLoading ? (
            // Loading Skeleton
            <>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className='flex flex-col lg:grid lg:grid-cols-[0.5fr_2fr_1fr_0.5fr_1.5fr_1.5fr_1fr_1fr] gap-2 lg:gap-1 items-start lg:items-center py-3 sm:py-4 px-3 sm:px-4 lg:px-6 border-b animate-pulse'>
                  
                  {/* Mobile Skeleton */}
                  <div className='lg:hidden w-full'>
                    <div className='flex items-start gap-3 mb-3'>
                      <div className='w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gray-200'></div>
                      <div className='flex-1 space-y-2'>
                        <div className='h-4 bg-gray-200 rounded w-3/4'></div>
                        <div className='h-3 bg-gray-200 rounded w-1/2'></div>
                        <div className='h-3 bg-gray-200 rounded w-1/3'></div>
                      </div>
                    </div>
                    <div className='flex gap-2 mb-3'>
                      <div className='h-6 bg-gray-200 rounded w-24'></div>
                      <div className='h-6 bg-gray-200 rounded w-20'></div>
                      <div className='h-6 bg-gray-200 rounded w-16'></div>
                    </div>
                    <div className='flex items-center gap-2 mb-3 pb-3 border-b border-gray-200'>
                      <div className='w-8 h-8 rounded-full bg-gray-200'></div>
                      <div className='space-y-2 flex-1'>
                        <div className='h-3 bg-gray-200 rounded w-16'></div>
                        <div className='h-3 bg-gray-200 rounded w-24'></div>
                      </div>
                    </div>
                    <div className='flex justify-end'>
                      <div className='h-8 bg-gray-200 rounded-lg w-24'></div>
                    </div>
                  </div>

                  {/* Desktop Skeleton */}
                  <div className='hidden lg:block h-4 bg-gray-200 rounded w-8'></div>
                  <div className='hidden lg:flex items-center gap-2'>
                    <div className='w-10 h-10 rounded-full bg-gray-200'></div>
                    <div className='h-4 bg-gray-200 rounded flex-1'></div>
                  </div>
                  <div className='hidden lg:block h-4 bg-gray-200 rounded w-20'></div>
                  <div className='hidden lg:block h-4 bg-gray-200 rounded w-8'></div>
                  <div className='hidden lg:block h-4 bg-gray-200 rounded w-32'></div>
                  <div className='hidden lg:flex items-center gap-2'>
                    <div className='w-8 h-8 rounded-full bg-gray-200'></div>
                    <div className='h-4 bg-gray-200 rounded flex-1'></div>
                  </div>
                  <div className='hidden lg:block h-4 bg-gray-200 rounded w-16'></div>
                  <div className='hidden lg:block h-8 bg-gray-200 rounded w-20'></div>
                </div>
              ))}
            </>
          ) : filteredAppointments.length === 0 ? (
            <div className='py-12 sm:py-16 text-center px-4'>
              <div className='mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3 sm:mb-4'>
                <Search className='w-6 h-6 sm:w-8 sm:h-8 text-gray-400' />
              </div>
              <h3 className='text-base sm:text-lg font-medium text-gray-700 mb-2'>No appointments found</h3>
              <p className='text-xs sm:text-sm text-gray-500'>
                {searchQuery ? 'Try adjusting your search or filters' : 'No appointments available'}
              </p>
              {(searchQuery || filters.status !== 'all' || filters.dateRange !== 'all') && (
                <button onClick={clearFilters} className='mt-3 sm:mt-4 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-blue-600 hover:text-blue-800 font-medium'>
                  Clear all filters
                </button>
              )}
            </div>
          ) : (
            filteredAppointments.map((item, index) => (
              <div 
                className='flex flex-col lg:grid lg:grid-cols-[0.5fr_2fr_1fr_0.5fr_1.5fr_1.5fr_1fr_1fr] gap-2 lg:gap-1 items-start lg:items-center text-gray-500 py-3 sm:py-4 px-3 sm:px-4 lg:px-6 border-b hover:bg-gray-50' 
                key={item._id}
              >
                {/* Mobile Card Layout */}
                <div className='lg:hidden w-full'>
                  <div className='flex items-start gap-3 mb-3'>
                    <img className='w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover flex-shrink-0' src={item.userData.image} alt="" />
                    <div className='flex-1 min-w-0'>
                      <p className='font-medium text-gray-800 text-sm sm:text-base mb-1'>{item.userData.name}</p>
                      <p className='text-xs text-gray-500 mb-1'>ID: {item.userData.patientId}</p>
                      <p className='text-xs text-gray-500'>Age: {calculateAge(item.userData.dob)} years</p>
                    </div>
                  </div>
                  
                  <div className='flex flex-wrap items-center gap-2 mb-3'>
                    <span className='text-xs bg-gray-100 px-2 py-1 rounded'>{slotDateFormat(item.slotDate)}</span>
                    <span className='text-xs bg-gray-100 px-2 py-1 rounded'>{item.slotTime}</span>
                    <span className='text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded'>{currency} {item.amount}</span>
                  </div>

                  <div className='flex items-center gap-2 mb-3 pb-3 border-b border-gray-200'>
                    <img className='w-8 h-8 rounded-full bg-gray-200 object-cover' src={item.docData.image} alt="" />
                    <div>
                      <p className='text-xs text-gray-500'>Doctor</p>
                      <p className='text-sm font-medium text-gray-700'>{item.docData.name}</p>
                    </div>
                  </div>
                  
                  <div className='flex justify-end'>
                    {item.cancelled ? (
                      <p className='text-red-500 text-xs font-medium px-3 py-1.5 bg-red-50 rounded-full'>Cancelled</p>
                    ) : item.isCompleted ? (
                      <p className='text-green-600 text-xs font-medium px-3 py-1.5 bg-green-50 rounded-full'>Completed</p>
                    ) : (
                      <button onClick={() => handleCancelAppointment(item._id)} className='flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-xs font-medium'>
                        <img className='w-4 h-4' src={assets.cancel_icon} alt="Cancel" />
                        Cancel
                      </button>
                    )}
                  </div>
                </div>

                {/* Desktop Grid Layout */}
                <p className='hidden lg:block'>{index + 1}</p>
                <div className='hidden lg:flex items-center gap-2'>
                  <img className='w-8 sm:w-9 md:w-10 h-8 sm:h-9 md:h-10 rounded-full object-cover' src={item.userData.image} alt="" /> 
                  <p className='truncate'>{item.userData.name}</p>
                </div>
                <p className='hidden lg:block truncate'>{item.userData.patientId}</p>
                <p className='hidden lg:block'>{calculateAge(item.userData.dob)}</p>
                <p className='hidden lg:block text-xs xl:text-sm'>{slotDateFormat(item.slotDate)}, {item.slotTime}</p>
                <div className='hidden lg:flex items-center gap-2'>
                  <img className='w-8 rounded-full bg-gray-200 object-cover' src={item.docData.image} alt="" /> 
                  <p className='truncate'>{item.docData.name}</p>
                </div>
                <p className='hidden lg:block'>{currency} {item.amount}</p>
                <div className='hidden lg:block'>
                  {item.cancelled ? (
                    <p className='text-red-500 text-xs font-medium px-2 py-1 bg-red-50 rounded-full inline-block'>Cancelled</p>
                  ) : item.isCompleted ? (
                    <p className='text-green-600 text-xs font-medium px-2 py-1 bg-green-50 rounded-full inline-block'>Completed</p>
                  ) : (
                    <img onClick={() => handleCancelAppointment(item._id)} className='w-8 sm:w-9 md:w-10 cursor-pointer hover:scale-110 transition-transform' src={assets.cancel_icon} alt="Cancel" />
                  )}
                </div>
              </div>
            ))
          )}

        </div>
      </div>
    </div>
  )
}

export default AllAppointments
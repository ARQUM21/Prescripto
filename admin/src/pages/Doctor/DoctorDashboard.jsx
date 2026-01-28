import React, { useContext, useEffect } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { assets } from "../../assets/assets";
import { AppContext } from "../../context/AppContext";

const DoctorDashboard = () => {
  const { dToken, dashData, getDashData, cancelAppointment } = useContext(DoctorContext);
  const { currency, slotDateFormat } = useContext(AppContext);

  useEffect(() => {
    if (dToken) {
      getDashData();
    }
  }, [dToken]);

  return (
    dashData && (
      <div className="p-3 sm:p-5 md:p-6 lg:p-8">
        {/* Main Container */}
        <div className="max-w-5xl">
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
            {/* Earnings Card */}
            <div className="flex items-center gap-2 sm:gap-3 bg-white p-3 sm:p-4 rounded-lg border-2 border-gray-200 cursor-pointer hover:scale-105 hover:shadow-lg transition-all">
              <img className="w-10 sm:w-12 md:w-14" src={assets.earning_icon} alt="Earnings" />
              <div>
                <p className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-600">
                  {currency} {dashData.earnings}
                </p>
                <p className="text-xs sm:text-base text-gray-400">Earnings</p>
              </div>
            </div>

            {/* Appointments Card */}
            <div className="flex items-center gap-2 sm:gap-3 bg-white p-3 sm:p-4 rounded-lg border-2 border-gray-200 cursor-pointer hover:scale-105 hover:shadow-lg transition-all">
              <img className="w-10 sm:w-12 md:w-14" src={assets.appointments_icon} alt="Appointments" />
              <div>
                <p className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-600">
                  {dashData.appointments}
                </p>
                <p className="text-xs sm:text-base text-gray-400">Appointments</p>
              </div>
            </div>

            {/* Patients Card */}
            <div className="flex items-center gap-2 sm:gap-3 bg-white p-3 sm:p-4 rounded-lg border-2 border-gray-200 cursor-pointer hover:scale-105 hover:shadow-lg transition-all sm:col-span-2 lg:col-span-1">
              <img className="w-10 sm:w-12 md:w-14" src={assets.patients_icon} alt="Patients" />
              <div>
                <p className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-600">
                  {dashData.patients}
                </p>
                <p className="text-xs sm:text-base text-gray-400">Patients</p>
              </div>
            </div>
          </div>

          {/* Latest Appointments */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            
            {/* Header */}
            <div className="flex items-center gap-2 sm:gap-2.5 px-3 sm:px-4 md:px-6 py-3 sm:py-4 border-b bg-gray-50">
              <img className="w-4 sm:w-5" src={assets.list_icon} alt="List" />
              <p className="font-semibold text-gray-700 text-sm sm:text-base md:text-lg">Latest Bookings</p>
            </div>

            {/* Appointments List */}
            <div className="divide-y divide-gray-100">
              {dashData.latestAppointments && dashData.latestAppointments.length > 0 ? (
                dashData.latestAppointments.map((item, index) => (
                  <div className="flex items-center px-3 sm:px-4 md:px-6 py-3 sm:py-4 gap-2 sm:gap-3 hover:bg-gray-50 transition-colors"
                    key={index} >

                    {/* Patient Image */}
                    <img
                      className="rounded-full w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 object-cover flex-shrink-0"
                      src={item.userData.image}
                      alt={item.userData.name}
                    />

                    {/* Patient Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-800 font-medium text-xs sm:text-sm md:text-base truncate">
                        {item.userData.name}
                      </p>
                      <p className="text-gray-500 text-[10px] sm:text-xs md:text-sm"> {slotDateFormat(item.slotDate)}</p>
                    </div>

                    {/* Status/Actions */}
                    <div className="flex-shrink-0">
                      {item.cancelled ? (
                        <p className="text-red-500 text-[10px] sm:text-xs md:text-sm font-medium px-2 sm:px-3 py-1 bg-red-50 rounded-full whitespace-nowrap">
                          Cancelled
                        </p>
                      ) : item.isCompleted ? (
                        <p className="text-green-600 text-[10px] sm:text-xs md:text-sm font-medium px-2 sm:px-3 py-1 bg-green-50 rounded-full whitespace-nowrap">
                          Completed
                        </p>
                      ) : (
                        <div className="flex gap-1 sm:gap-1.5 md:gap-2">
                          <img
                            onClick={() => cancelAppointment(item._id)}
                            className="w-7 sm:w-8 md:w-9 lg:w-10 cursor-pointer hover:scale-110 transition-transform"
                            src={assets.cancel_icon}
                            alt="Cancel"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 sm:py-12">
                  <p className="text-gray-400 text-xs sm:text-sm">No appointments yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default DoctorDashboard;
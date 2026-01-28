import React, { useContext, useEffect, useState, useMemo } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";
import { toast } from "react-toastify";
import { Search, X, ChevronDown, ChevronUp, SlidersHorizontal, ArrowLeft, Stethoscope, Thermometer, Pill, Calendar, FileText, Clipboard, Activity, FileCheck,} from "lucide-react";

const DoctorAppointments = () => {
  const { dToken, appointments, getAppointments, completeAppointment, cancelAppointment} = useContext(DoctorContext);
  const { calculateAge, slotDateFormat, currency } = useContext(AppContext);

  const [showForm, setShowForm] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [diagnosis, setDiagnosis] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [medicines, setMedicines] = useState("");
  const [instructions, setInstructions] = useState("");
  const [nextVisit, setNextVisit] = useState("");
  const [labTests, setLabTests] = useState("");
  const [documentation, setDocumentation] = useState("");

  // Search and Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: "all",
    dateRange: "all",
  });

  useEffect(() => {
  const fetchData = async () => {
    if (dToken) {
      setLoading(true);
      await getAppointments();
      setLoading(false);
    }
  };
  fetchData();
}, [dToken]);

  // Filtered Appointments
  const filteredAppointments = useMemo(() => {
    let result = [...appointments];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter((item) =>
        item.userData.patientId?.toLowerCase().includes(query)
      );
    }

    if (filters.status !== "all") {
      result = result.filter((item) => {
        if (filters.status === "pending")
          return !item.isCompleted && !item.cancelled;
        if (filters.status === "completed") return item.isCompleted;
        if (filters.status === "cancelled") return item.cancelled;
        return true;
      });
    }

    if (filters.dateRange !== "all") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      result = result.filter((item) => {
        const [day, month, year] = item.slotDate.split("_").map(Number);
        const appointmentDate = new Date(year, month - 1, day);
        appointmentDate.setHours(0, 0, 0, 0);

        const daysDiff = Math.floor(
          (appointmentDate - today) / (1000 * 60 * 60 * 24)
        );

        if (filters.dateRange === "today") return daysDiff === 0;
        if (filters.dateRange === "tomorrow") return daysDiff === 1;
        if (filters.dateRange === "week")
          return daysDiff >= -7 && daysDiff <= 0;
        if (filters.dateRange === "15days")
          return daysDiff >= -15 && daysDiff <= 0;
        if (filters.dateRange === "month")
          return daysDiff >= -30 && daysDiff <= 0;

        return true;
      });
    }

    return result;
  }, [appointments, searchQuery, filters]);

  const handleCompleteClick = (appointment) => {
    setSelectedAppointment(appointment);
    setShowForm(true);
    setDiagnosis("");
    setSymptoms("");
    setMedicines("");
    setInstructions("");
    setNextVisit("");
    setLabTests("");
    setDocumentation("");
  };

  const onSubmitHandler = async () => {
    try {
      if (!diagnosis) {
        return toast.error("Please enter diagnosis");
      }
      if (!symptoms) {
        return toast.error("Please enter symptoms");
      }
      if (!medicines) {
        return toast.error("Please enter medicines");
      }
      if (!instructions) {
        return toast.error("Please enter instructions");
      }
      if (!nextVisit) {
        return toast.error("Please enter next visit date");
      }
      if (!documentation) {
        return toast.error("Please written documentation");
      }

      setSubmitting(true);

      const formData = { diagnosis, symptoms, medicines, instructions, nextVisit, labTests, documentation};

      const success = await completeAppointment(
        selectedAppointment._id,
        formData
      );

      if (success) {
        setShowForm(false);
        setSelectedAppointment(null);
        setDiagnosis("");
        setSymptoms("");
        setMedicines("");
        setInstructions("");
        setNextVisit("");
        setLabTests("");
        setDocumentation("");
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setSelectedAppointment(null);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setFilters({
      status: "all",
      dateRange: "all",
    });
  };

  if (showForm && selectedAppointment) {
    return (
      <div className="p-3 sm:p-5 md:p-6 lg:p-8 w-full">
        <div className="max-w-4xl">
          <button
            onClick={handleCancel}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition text-sm sm:text-base mb-6"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="font-medium">Back to Appointments</span>
          </button>

          <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 md:p-8 border border-gray-200">
            <div className="mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                Complete Appointment
              </h2>
              <p className="text-sm sm:text-base text-gray-600">
                Fill in the patient consultation details
              </p>
            </div>

            {/* Patient Information Card */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg sm:rounded-xl p-4 sm:p-6 mb-6 sm:mb-8 border border-blue-100">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                <div className="relative">
                  <img className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-white shadow-md" src={selectedAppointment.userData.image} alt=""/>
                </div>
                <div className="flex-1 w-full">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800">
                    {selectedAppointment.userData.name}
                  </h3>

                  <div className="flex items-center gap-2 mb-2 sm:mb-3 mt-1">
                    <span className="text-blue-800 text-xs sm:text-sm font-semibold">
                      Patient ID: {selectedAppointment.userData.patientId}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 sm:gap-3 mt-2">
                    <span className="inline-flex items-center gap-2 bg-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm text-gray-700 border border-gray-200 shadow-sm">
                      {slotDateFormat(selectedAppointment.slotDate)}
                    </span>
                    <span className="inline-flex items-center gap-2 bg-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm text-gray-700 border border-gray-200 shadow-sm">
                      {selectedAppointment.slotTime}
                    </span>
                    <span className="inline-flex items-center gap-2 bg-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm text-gray-700 border border-gray-200 shadow-sm">
                      Age: {calculateAge(selectedAppointment.userData.dob)}{" "}
                      years
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Vertical Form Layout */}
            <div className="space-y-6 sm:space-y-8">
              {/* Diagnosis */}
              <div className="border-l-4 border-primary pl-4">
                <div className="flex items-center gap-3 mb-3">
                  <Stethoscope className="w-5 h-5 text-primary" />
                  <label className="block text-gray-700 font-semibold text-sm sm:text-base">
                    Diagnosis
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                </div>
                <input
                  onChange={(e) => setDiagnosis(e.target.value)}
                  value={diagnosis}
                  className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  type="text"
                  placeholder="Enter disease name"
                />
                <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">
                  Enter the primary diagnosis
                </p>
              </div>

              {/* Symptoms */}
              <div className="border-l-4 border-blue-500 pl-4">
                <div className="flex items-center gap-3 mb-3">
                  <Thermometer className="w-5 h-5 text-blue-500" />
                  <label className="block text-gray-700 font-semibold text-sm sm:text-base">
                    Symptoms
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                </div>
                <textarea
                  onChange={(e) => setSymptoms(e.target.value)}
                  value={symptoms}
                  className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 h-32 sm:h-40"
                  placeholder="Describe all symptoms in detail..."
                />
                <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">
                  Include duration and severity of symptoms
                </p>
              </div>

              {/* Medicines */}
              <div className="border-l-4 border-green-500 pl-4">
                <div className="flex items-center gap-3 mb-3">
                  <Pill className="w-5 h-5 text-green-500" />
                  <label className="block text-gray-700 font-semibold text-sm sm:text-base">
                    Prescribed Medicines
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                </div>
                <textarea
                  onChange={(e) => setMedicines(e.target.value)}
                  value={medicines}
                  className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 h-40 sm:h-48"
                  placeholder="Medicine name, dosage, frequency, duration..."
                />
                <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">
                  Format: Medicine - Dosage - Frequency - Duration
                </p>
              </div>

              {/* Instructions */}
              <div className="border-l-4 border-purple-500 pl-4">
                <div className="flex items-center gap-3 mb-3">
                  <Clipboard className="w-5 h-5 text-purple-500" />
                  <label className="block text-gray-700 font-semibold text-sm sm:text-base">
                    Patient Instructions
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                </div>
                <textarea
                  onChange={(e) => setInstructions(e.target.value)}
                  value={instructions}
                  className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 h-32 sm:h-40"
                  placeholder="Diet, rest, activities, precautions..."
                />
                <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">
                  Guidelines for the patient to follow
                </p>
              </div>

              {/* Next Visit */}
              <div className="border-l-4 border-yellow-500 pl-4">
                <div className="flex items-center gap-3 mb-3">
                  <Calendar className="w-5 h-5 text-yellow-500" />
                  <label className="block text-gray-700 font-semibold text-sm sm:text-base">
                    Follow-up Appointment
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                </div>
                <input
                  onChange={(e) => setNextVisit(e.target.value)}
                  value={nextVisit}
                  className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  type="text"
                  placeholder="e.g., After 1 week, After 3 days"
                />
                <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">
                  Specify when the patient should visit next
                </p>
              </div>

              {/* Lab Tests */}
              <div className="border-l-4 border-red-500 pl-4">
                <div className="flex items-center gap-3 mb-3">
                  <Activity className="w-5 h-5 text-red-500" />
                  <label className="block text-gray-700 font-semibold text-sm sm:text-base">
                    Recommended Lab Tests (Optional)
                  </label>
                </div>
                <textarea
                  onChange={(e) => setLabTests(e.target.value)}
                  value={labTests}
                  className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 h-28 sm:h-32"
                  placeholder="Enter recommended laboratory tests..."
                />
                <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">
                  Add any recommended tests for the patient
                </p>
              </div>

              {/* Documentation */}
              <div className="border-l-4 border-indigo-500 pl-4">
                <div className="flex items-center gap-3 mb-3">
                  <FileText className="w-5 h-5 text-indigo-500" />
                  <label className="block text-gray-700 font-semibold text-sm sm:text-base">
                    Documentation
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                </div>
                <textarea
                  onChange={(e) => setDocumentation(e.target.value)}
                  value={documentation}
                  className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 h-28 sm:h-32"
                  placeholder="Any additional observations or special instructions..."
                />
                <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">
                  Documentation
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 ">
                <button
                  onClick={onSubmitHandler}
                  disabled={submitting} // ⭐ Add this
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 sm:py-4 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-blue-600 disabled:hover:to-indigo-600" // ⭐ Add disabled classes
                >
                  {submitting ? ( // ⭐ Add loading spinner
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <FileCheck className="w-5 h-5" />
                      Complete Appointment
                    </>
                  )}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={submitting} // ⭐ Add this
                  className="px-6 sm:px-8 py-3 sm:py-4 border-2 border-gray-300 text-gray-700 rounded-lg sm:rounded-xl text-sm sm:text-base font-medium hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed" // ⭐ Add disabled classes
                >
                  Cancel
                </button>
              </div>

              <div className="mt-4 sm:mt-6 flex items-center justify-center text-xs sm:text-sm text-gray-500">
                <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-blue-500"></div>
                </div>
                Fields marked with <span className="text-red-500 mx-1">*</span>{" "}
                are required
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-3 sm:p-5 md:p-6 lg:p-8">
      <div className="max-w-6xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-4">
          <div>
            <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 flex items-center gap-2">
              <FileText className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7  text-blue-600" />{" "}
              Appointments
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-gray-600 mt-1 ml-6 sm:ml-9">
              Manage and track all patient appointments
            </p>
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {showFilters ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 mb-4 sm:mb-6">
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
                onClick={() => setSearchQuery("")}
                className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            )}
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex justify-between items-center mb-3 sm:mb-4">
                <h3 className="font-semibold text-gray-700 text-sm sm:text-base">
                  Filter Appointments
                </h3>
                <button onClick={clearFilters} className="text-xs sm:text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1">
                  <X className="w-3 h-3 sm:w-4 sm:h-4" />
                  Clear all
                </button>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-3 sm:space-y-0">
                {/* Status Filter */}
                <div className="flex-1">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                {/* Date Range Filter */}
                <div className="flex-1">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Date Range
                  </label>
                  <select
                    value={filters.dateRange}
                    onChange={(e) =>
                      setFilters({ ...filters, dateRange: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
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
              <div className="flex flex-wrap gap-2 mt-3 sm:mt-4">
                {searchQuery && (
                  <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-[10px] sm:text-xs px-2 sm:px-3 py-1 rounded-full">
                    Search: "{searchQuery}"
                    <button
                      onClick={() => setSearchQuery("")}
                      className="ml-1 hover:text-blue-900"
                    >
                      <X className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                    </button>
                  </span>
                )}

                {filters.status !== "all" && (
                  <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 text-[10px] sm:text-xs px-2 sm:px-3 py-1 rounded-full">
                    Status: {filters.status}
                    <button
                      onClick={() => setFilters({ ...filters, status: "all" })}
                      className="ml-1 hover:text-green-900"
                    >
                      <X className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                    </button>
                  </span>
                )}

                {filters.dateRange !== "all" && (
                  <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-800 text-[10px] sm:text-xs px-2 sm:px-3 py-1 rounded-full">
                    Date:{" "}
                    {filters.dateRange === "today"
                      ? "Today"
                      : filters.dateRange === "tomorrow"
                      ? "Tomorrow"
                      : filters.dateRange === "week"
                      ? "Last 7 Days"
                      : filters.dateRange === "15days"
                      ? "Last 15 Days"
                      : filters.dateRange === "month"
                      ? "Last 30 Days"
                      : filters.dateRange}
                    <button
                      onClick={() =>
                        setFilters({ ...filters, dateRange: "all" })
                      }
                      className="ml-1 hover:text-purple-900"
                    >
                      <X className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                    </button>
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Stats Summary */}
        <div className="flex flex-wrap gap-2 sm:gap-3 md:gap-4 mb-4 text-[10px] sm:text-xs md:text-sm">
          <span className="px-2 sm:px-3 py-1 bg-blue-50 text-blue-700 rounded-full whitespace-nowrap">
            Total: {appointments.length}
          </span>
          <span className="px-2 sm:px-3 py-1 bg-yellow-50 text-yellow-700 rounded-full whitespace-nowrap">
            Pending:{" "}
            {appointments.filter((a) => !a.isCompleted && !a.cancelled).length}
          </span>
          <span className="px-2 sm:px-3 py-1 bg-green-50 text-green-700 rounded-full whitespace-nowrap">
            Completed: {appointments.filter((a) => a.isCompleted).length}
          </span>
          <span className="px-2 sm:px-3 py-1 bg-red-50 text-red-700 rounded-full whitespace-nowrap">
            Cancelled: {appointments.filter((a) => a.cancelled).length}
          </span>
          <span className="px-2 sm:px-3 py-1 bg-gray-100 text-gray-700 rounded-full whitespace-nowrap">
            Showing: {filteredAppointments.length}
          </span>
        </div>

        {/* Appointments Table */}
        <div className="bg-white border rounded-lg text-xs sm:text-sm max-h-[70vh] sm:max-h-[80vh] min-h-[40vh] sm:min-h-[50vh] overflow-y-auto overflow-x-auto">
          <div className="hidden lg:grid grid-cols-[0.5fr_2fr_1fr_0.5fr_1.5fr_1fr_1fr] gap-1 py-3 px-4 sm:px-6 border-b bg-gray-50 sticky top-0 z-10">
            <p className="font-medium">#</p>
            <p className="font-medium">Patient</p>
            <p className="font-medium">Patient ID</p>
            <p className="font-medium">Age</p>
            <p className="font-medium">Date & Time</p>
            <p className="font-medium">Fees</p>
            <p className="font-medium">Action</p>
          </div>

          {loading ? (
            // Loading Skeleton
            <>
              {/* Mobile Skeleton */}
              <div className="lg:hidden">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="p-3 sm:p-4 border-b animate-pulse">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gray-200 rounded-full flex-shrink-0"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2 mb-1"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                      </div>
                    </div>
                    <div className="flex gap-2 mb-3">
                      <div className="h-6 bg-gray-200 rounded w-20"></div>
                      <div className="h-6 bg-gray-200 rounded w-16"></div>
                      <div className="h-6 bg-gray-200 rounded w-12"></div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <div className="h-8 bg-gray-200 rounded w-20"></div>
                      <div className="h-8 bg-gray-200 rounded w-24"></div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Skeleton */}
              <div className="hidden lg:block">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-[0.5fr_2fr_1fr_0.5fr_1.5fr_1fr_1fr] gap-1 py-4 px-6 border-b animate-pulse"
                  >
                    <div className="h-4 bg-gray-200 rounded w-6"></div>
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                      <div className="h-4 bg-gray-200 rounded w-32"></div>
                    </div>
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                    <div className="h-4 bg-gray-200 rounded w-8"></div>
                    <div className="h-4 bg-gray-200 rounded w-36"></div>
                    <div className="h-4 bg-gray-200 rounded w-12"></div>
                    <div className="flex gap-1">
                      <div className="w-10 h-10 bg-gray-200 rounded"></div>
                      <div className="w-10 h-10 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : filteredAppointments.length === 0 ? (
            <div className="py-12 sm:py-16 text-center px-4">
              <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                <Search className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
              </div>
              <h3 className="text-base sm:text-lg font-medium text-gray-700 mb-2">
                No appointments found
              </h3>
              <p className="text-xs sm:text-sm text-gray-500">
                {searchQuery
                  ? "Try adjusting your search or filters"
                  : "No appointments scheduled yet"}
              </p>
              {(searchQuery || filters.status !== "all") && (
                <button
                  onClick={clearFilters}
                  className="mt-3 sm:mt-4 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Clear all filters
                </button>
              )}
            </div>
          ) : (
            filteredAppointments.map((item, index) => (
              <div
                className="flex flex-col lg:grid lg:grid-cols-[0.5fr_2fr_1fr_0.5fr_1.5fr_1fr_1fr] gap-2 lg:gap-1 items-start lg:items-center text-gray-500 py-3 sm:py-4 px-3 sm:px-4 lg:px-6 border-b hover:bg-gray-50"
                key={item._id}
              >
                {/* Mobile Card Layout */}
                <div className="lg:hidden w-full">
                  <div className="flex items-start gap-3 mb-3">
                    <img
                      className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover flex-shrink-0"
                      src={item.userData.image}
                      alt=""
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 text-sm sm:text-base mb-1">
                        {item.userData.name}
                      </p>
                      <p className="text-xs text-gray-500 mb-1">
                        ID: {item.userData.patientId}
                      </p>
                      <p className="text-xs text-gray-500">
                        Age: {calculateAge(item.userData.dob)} years
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {slotDateFormat(item.slotDate)}
                    </span>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {item.slotTime}
                    </span>
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                      {currency} {item.amount}
                    </span>
                  </div>

                  <div className="flex justify-end">
                    {item.cancelled ? (
                      <p className="text-red-500 text-xs font-medium px-3 py-1.5 bg-red-50 rounded-full">
                        Cancelled
                      </p>
                    ) : item.isCompleted ? (
                      <p className="text-green-600 text-xs font-medium px-3 py-1.5 bg-green-50 rounded-full">
                        Completed
                      </p>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={() => cancelAppointment(item._id)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-xs font-medium"
                        >
                          <img className="w-4 h-4" src={assets.cancel_icon} alt="Cancel"/>
                          Cancel
                        </button>
                        <button
                          onClick={() => handleCompleteClick(item)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors text-xs font-medium"
                        >
                          <img className="w-4 h-4" src={assets.tick_icon} alt="Complete" />
                          Complete
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Desktop Grid Layout */}
                <p className="hidden lg:block">{index + 1}</p>
                <div className="hidden lg:flex items-center gap-2">
                  <img className="w-8 sm:w-9 md:w-10 h-8 sm:h-9 md:h-10 rounded-full object-cover" src={item.userData.image} alt=""/>
                  <p className="truncate">{item.userData.name}</p>
                </div>
                <p className="hidden lg:block truncate">
                  {item.userData.patientId}
                </p>
                <p className="hidden lg:block">
                  {calculateAge(item.userData.dob)}
                </p>
                <p className="hidden lg:block text-xs xl:text-sm">
                  {slotDateFormat(item.slotDate)}, {item.slotTime}
                </p>
                <p className="hidden lg:block">
                  {currency} {item.amount}
                </p>
                <div className="hidden lg:block">
                  {item.cancelled ? (
                    <p className="text-red-500 text-xs font-medium px-2 py-1 bg-red-50 rounded-full inline-block">
                      Cancelled
                    </p>
                  ) : item.isCompleted ? (
                    <p className="text-green-600 text-xs font-medium px-2 py-1 bg-green-50 rounded-full inline-block">
                      Completed
                    </p>
                  ) : (
                    <div className="flex gap-1">
                      <img onClick={() => cancelAppointment(item._id)} className="w-8 sm:w-9 md:w-10 cursor-pointer hover:scale-110 transition-transform" src={assets.cancel_icon} alt="Cancel"/>
                      <img
                        onClick={() => handleCompleteClick(item)}
                        className="w-8 sm:w-9 md:w-10 cursor-pointer hover:scale-110 transition-transform"
                        src={assets.tick_icon}
                        alt="Complete"
                      />
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorAppointments;

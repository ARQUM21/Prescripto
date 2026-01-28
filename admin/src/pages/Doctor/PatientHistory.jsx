import React, { useContext, useEffect, useState, useMemo } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";
import { Search, X, ChevronDown, ChevronUp, SlidersHorizontal, ArrowLeft, FileText, Calendar, DollarSign, Clock, User, Stethoscope, Thermometer, Pill, Clipboard, Activity, CheckCircle2, AlertCircle, Edit2, Save, XCircle } from 'lucide-react';

const PatientHistory = () => {
  const { dToken, history, getpatienthistory, editPrescription } = useContext(DoctorContext);
  const { calculateAge, slotDateFormat, currency } = useContext(AppContext);
  
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [loading, setLoading] = useState(true);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    editedStatus: 'all',
    dateRange: 'all',
  });

  useEffect(() => {
  const fetchData = async () => {
    if (dToken) {
      setLoading(true);
      await getpatienthistory();
      setLoading(false);
    }
  };
  fetchData();
}, [dToken]);

  // Filtered History
  const filteredHistory = useMemo(() => {
    let result = [...history];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(item => 
        item.userData.patientId?.toLowerCase().includes(query)
      );
    }

    if (filters.editedStatus !== 'all') {
      result = result.filter(item => {
        if (filters.editedStatus === 'edited') return item.isEdited === true;
        if (filters.editedStatus === 'not-edited') return !item.isEdited;
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
        
        const daysDiff = Math.floor((today - appointmentDate) / (1000 * 60 * 60 * 24));
        
        if (filters.dateRange === 'today') return daysDiff === 0;
        if (filters.dateRange === 'tomorrow') return daysDiff === -1;
        if (filters.dateRange === 'week') return daysDiff >= 0 && daysDiff <= 7;
        if (filters.dateRange === '15days') return daysDiff >= 0 && daysDiff <= 15;
        if (filters.dateRange === 'month') return daysDiff >= 0 && daysDiff <= 30;
        
        return true;
      });
    }


    return result.reverse();
  }, [history, searchQuery, filters]);

  const clearFilters = () => {
    setSearchQuery('');
    setFilters({
      editedStatus: 'all',
      dateRange: 'all',
    });
  };

  const handleViewDetails = (item) => {
    setSelectedPatient(item);
    setShowDetail(true);
    setIsEditing(false);
    setEditData({
      diagnosis: item.diagnosis || '',
      symptoms: item.symptoms || '',
      medicines: item.medicines || '',
      instructions: item.instructions || '',
      nextVisit: item.nextVisit || '',
      labTests: item.labTests || '',
      documentation: item.documentation || ''
    });
  };

  const handleBack = () => {
    setShowDetail(false);
    setSelectedPatient(null);
    setIsEditing(false);
  };

  const shouldShowEditButton = () => {
    if (!selectedPatient) return false;
    if (selectedPatient.isEdited) return false;
    if (!selectedPatient.createdAt) return false;
    
    const createdTime = new Date(selectedPatient.createdAt).getTime();
    const hoursPassed = (Date.now() - createdTime) / (1000 * 60 * 60);
    
    return hoursPassed <= 24;
  };

  const getCannotEditMessage = () => {
    if (!selectedPatient) return null;
    
    if (selectedPatient.isEdited) {
      return "This prescription has already been edited once";
    }
    
    if (!selectedPatient.createdAt) {
      return 'Cannot edit: Prescription is old';
    }
    
    const createdTime = new Date(selectedPatient.createdAt).getTime();
    const hoursPassed = (Date.now() - createdTime) / (1000 * 60 * 60);
    
    if (hoursPassed > 24) {
      return "Cannot edit after 24 hours";
    }
    
    return null;
  };

  const handleEdit = () => setIsEditing(true);
  
  const handleCancel = () => {
    setIsEditing(false);
    setEditData({
      diagnosis: selectedPatient.diagnosis || '',
      symptoms: selectedPatient.symptoms || '',
      medicines: selectedPatient.medicines || '',
      instructions: selectedPatient.instructions || '',
      nextVisit: selectedPatient.nextVisit || '',
      labTests: selectedPatient.labTests || '',
      documentation: selectedPatient.documentation || ''
    });
  };

  const handleChange = (field, value) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      const success = await editPrescription(selectedPatient._id, editData);
      if (success) {
        toast.success("Prescription updated successfully!");
        await getpatienthistory();
        setShowDetail(false);
        setSelectedPatient(null);
        setIsEditing(false);
      } else {
        toast.error("Failed to update prescription");
      }
    } catch (error) {
      toast.error("Error updating prescription");
      console.error(error);
    }
  };

  // Detail View
  if (showDetail && selectedPatient) {
    const canShowEdit = shouldShowEditButton();
    const cannotEditMsg = getCannotEditMessage();

  return (
    <div className="w-full p-3 sm:p-5 md:p-6 lg:p-8">
        <div className="max-w-5xl">
          
        {/* Header */}
        <div className="flex items-center justify-between gap-2 sm:gap-4 mb-5 sm:mb-6">
        {/* Left side - Back button */}
        <button 
          onClick={handleBack}
          className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition text-sm sm:text-base font-medium flex-shrink-0"
        >
        <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="hidden sm:inline">Back to History</span>
          <span className="sm:hidden">Back</span>
        </button>
  
        {/* Right side - Status badge */}
        {selectedPatient.isEdited && (
        <div className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-green-50 text-green-700 border border-green-200 rounded-full text-xs sm:text-sm font-medium">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span className="hidden sm:inline">Already Edited</span>
          <span className="sm:hidden">Edited</span>
        </div>
        )}
      </div>


        {/* Cannot Edit Warning */}
          {cannotEditMsg && (
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 text-red-700 rounded-lg sm:rounded-xl border border-red-200">
              <div className="flex items-start gap-2 sm:gap-3">
                <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold text-sm sm:text-base">{cannotEditMsg}</p>
                  {selectedPatient.createdAt && (
                    <div className="text-xs sm:text-sm mt-2 space-y-1">
                      <p>Created: {new Date(selectedPatient.createdAt).toLocaleString()}</p>
                      {selectedPatient.isEdited && selectedPatient.editHistory?.[0] && (
                        <p>Edited: {new Date(selectedPatient.editHistory[0].editedAt).toLocaleString()}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Patient Info Card */}
          <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6 border border-blue-100 shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
              <img className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-white shadow-lg" src={selectedPatient.userData.image} alt="" />
              <div className="flex-1 w-full">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">{selectedPatient.userData.name}</h2>
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="inline-flex items-center gap-1.5 bg-blue-600 text-white text-xs sm:text-sm font-semibold px-3 py-1 rounded-full">
                    <User className="w-3 h-3 sm:w-4 sm:h-4" />
                    {selectedPatient.userData.patientId}
                  </span>
                  <span className="inline-flex items-center gap-1.5 bg-white text-gray-700 text-xs sm:text-sm px-3 py-1 rounded-full border border-gray-200">
                    Age: {calculateAge(selectedPatient.userData.dob)} years
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-gray-600">
                  <p className="flex items-center gap-2">
                    <span className="font-medium">Email:</span> {selectedPatient.userData.email}
                  </p>
                  {selectedPatient.userData.phone && (
                    <p className="flex items-center gap-2">
                      <span className="font-medium">Phone:</span> {selectedPatient.userData.phone}
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
                <p className="text-sm sm:text-base font-semibold text-gray-800">{slotDateFormat(selectedPatient.slotDate)}</p>
              </div>
              
              <div className="bg-purple-50 rounded-lg p-3 sm:p-4 border border-purple-100">
                <p className="text-xs sm:text-sm text-gray-600 mb-1 flex items-center gap-1">
                  <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                  Time
                </p>
                <p className="text-sm sm:text-base font-semibold text-gray-800">{selectedPatient.slotTime}</p>
              </div>
              
              <div className="bg-green-50 rounded-lg p-3 sm:p-4 border border-green-100">
                <p className="text-xs sm:text-sm text-gray-600 mb-1 flex items-center gap-1">
                  <DollarSign className="w-3 h-3 sm:w-4 sm:h-4" />
                  Fees
                </p>
                <p className="text-sm sm:text-base font-semibold text-gray-800">{currency} {selectedPatient.amount}</p>
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
            {selectedPatient.createdAt && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="text-sm sm:text-base font-semibold text-gray-700 mb-3">Prescription Timeline</h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-gray-700">Created</p>
                      <p className="text-xs text-gray-500">{new Date(selectedPatient.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                  {selectedPatient.isEdited && selectedPatient.editHistory?.[0] && (
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-gray-700">Last Edited</p>
                        <p className="text-xs text-gray-500">{new Date(selectedPatient.editHistory[0].editedAt).toLocaleString()}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Medical Details */}
          <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 flex items-center gap-2">
                <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                Medical Details
                {isEditing && <span className="text-blue-600 text-sm sm:text-base ml-2">(Editing Mode)</span>}
              </h3>
            </div>
            
            <div className="space-y-5 sm:space-y-6">
              
              {/* Diagnosis */}
              <div className="border-l-4 border-blue-600 pl-4">
                <div className="flex items-center gap-2 mb-2">
                  <Stethoscope className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  <label className="text-sm sm:text-base font-semibold text-gray-700">Diagnosis</label>
                </div>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.diagnosis}
                    onChange={(e) => handleChange('diagnosis', e.target.value)}
                    className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm sm:text-base"
                    placeholder="Enter diagnosis"
                  />
                ) : (
                  <p className="p-2 sm:p-3 bg-blue-50 rounded-lg border border-blue-200 text-sm sm:text-base text-gray-800">
                    {selectedPatient.diagnosis || 'Not specified'}
                  </p>
                )}
              </div>

              {/* Symptoms */}
              <div className="border-l-4 border-orange-500 pl-4">
                <div className="flex items-center gap-2 mb-2">
                  <Thermometer className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
                  <label className="text-sm sm:text-base font-semibold text-gray-700">Symptoms</label>
                </div>
                {isEditing ? (
                  <textarea
                    value={editData.symptoms}
                    onChange={(e) => handleChange('symptoms', e.target.value)}
                    rows={3}
                    className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm sm:text-base"
                    placeholder="Describe symptoms"
                  />
                ) : (
                  <p className="p-2 sm:p-3 bg-orange-50 rounded-lg border border-orange-200 text-sm sm:text-base text-gray-800 whitespace-pre-line">
                    {selectedPatient.symptoms || 'Not specified'}
                  </p>
                )}
              </div>

              {/* Medicines */}
              <div className="border-l-4 border-green-600 pl-4">
                <div className="flex items-center gap-2 mb-2">
                  <Pill className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                  <label className="text-sm sm:text-base font-semibold text-gray-700">Prescribed Medicines</label>
                </div>
                {isEditing ? (
                  <textarea
                    value={editData.medicines}
                    onChange={(e) => handleChange('medicines', e.target.value)}
                    rows={4}
                    className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm sm:text-base"
                    placeholder="List medicines with dosage"
                  />
                ) : (
                  <p className="p-2 sm:p-3 bg-green-50 rounded-lg border border-green-200 text-sm sm:text-base text-gray-800 whitespace-pre-line">
                    {selectedPatient.medicines || 'Not specified'}
                  </p>
                )}
              </div>

              {/* Instructions */}
              <div className="border-l-4 border-purple-600 pl-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clipboard className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                  <label className="text-sm sm:text-base font-semibold text-gray-700">Patient Instructions</label>
                </div>
                {isEditing ? (
                  <textarea
                    value={editData.instructions}
                    onChange={(e) => handleChange('instructions', e.target.value)}
                    rows={3}
                    className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm sm:text-base"
                    placeholder="Enter instructions"
                  />
                ) : (
                  <p className="p-2 sm:p-3 bg-purple-50 rounded-lg border border-purple-200 text-sm sm:text-base text-gray-800 whitespace-pre-line">
                    {selectedPatient.instructions || 'Not specified'}
                  </p>
                )}
              </div>

              {/* Lab Tests */}
              <div className="border-l-4 border-red-500 pl-4">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
                  <label className="text-sm sm:text-base font-semibold text-gray-700">Lab Tests</label>
                </div>
                {isEditing ? (
                  <textarea
                    value={editData.labTests}
                    onChange={(e) => handleChange('labTests', e.target.value)}
                    rows={2}
                    className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm sm:text-base"
                    placeholder="Recommended tests"
                  />
                ) : (
                  <p className="p-2 sm:p-3 bg-red-50 rounded-lg border border-red-200 text-sm sm:text-base text-gray-800">
                    {selectedPatient.labTests || 'Not specified'}
                  </p>
                )}
              </div>

              {/* Next Visit */}
              <div className="border-l-4 border-yellow-500 pl-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
                  <label className="text-sm sm:text-base font-semibold text-gray-700">Follow-up Visit</label>
                </div>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.nextVisit}
                    onChange={(e) => handleChange('nextVisit', e.target.value)}
                    className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm sm:text-base"
                    placeholder="e.g., After 1 week"
                  />
                ) : (
                  <p className="p-2 sm:p-3 bg-yellow-50 rounded-lg border border-yellow-200 text-sm sm:text-base text-gray-800">
                    {selectedPatient.nextVisit || 'Not specified'}
                  </p>
                )}
              </div>

              {/* Documentation */}
              <div className="border-l-4 border-indigo-600 pl-4">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
                  <label className="text-sm sm:text-base font-semibold text-gray-700">Documentation</label>
                </div>
                {isEditing ? (
                  <textarea
                    value={editData.documentation}
                    onChange={(e) => handleChange('documentation', e.target.value)}
                    rows={3}
                    className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm sm:text-base"
                    placeholder="Additional notes"
                  />
                ) : (
                  <p className="p-2 sm:p-3 bg-indigo-50 rounded-lg border border-indigo-200 text-sm sm:text-base text-gray-800">
                    {selectedPatient.documentation || 'No notes'}
                  </p>
                )}
              </div>
            </div>

          
            {/* Action Buttons */}
            <div className="mt-6 sm:mt-8 pt-6 border-t border-gray-200">
              {!isEditing && canShowEdit && !cannotEditMsg ? (
                <button
                  onClick={handleEdit}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold text-sm sm:text-base"
                >
                  <Edit2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  Edit Prescription
                </button>
              ) : isEditing ? (
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleSave}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold text-sm sm:text-base"
                  >
                    <Save className="w-4 h-4 sm:w-5 sm:h-5" />
                    Save Changes
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition font-semibold text-sm sm:text-base"
                  >
                    <XCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                    Cancel
                  </button>
                </div>
              ) : cannotEditMsg ? (
                <div className="flex items-start gap-2 text-red-600 text-xs sm:text-sm">
                  <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5" />
                  <p><span className="font-semibold">Note:</span> {cannotEditMsg}</p>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    );
  }



  // List View
  return (
    <div className="w-full p-3 sm:p-5 md:p-6 lg:p-8">
      <div className="max-w-7xl">
        
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-5 sm:mb-6 gap-3 sm:gap-4">
          <div>
            <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 flex items-center gap-2">
              <FileText className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7  text-blue-600" />
              Patient History
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-gray-600 mt-1 ml-6 sm:ml-9">View and manage completed appointments</p>
          </div>
          
          <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm">
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {/* Search & Filters */}
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
              <button onClick={() => setSearchQuery('')} className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              )}
            </div>

        {showFilters && (
          <div className='mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200'>
            <div className='flex justify-between items-center mb-4'>
              <h3 className='font-semibold text-gray-700'>Filter History</h3>
              <button onClick={clearFilters} className='text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1'>
                <X className='w-4 h-4' />
                Clear all
              </button>
            </div>
            
            <div className='flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0'>
              
              {/* Edited Status Filter */}
              <div className='flex-1'>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Edit Status</label>
                <select
                  value={filters.editedStatus}
                  onChange={(e) => setFilters({...filters, editedStatus: e.target.value})}
                  className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                >
                  <option value="all">All Records</option>
                  <option value="edited">Edited Only</option>
                  <option value="not-edited">Not Edited</option>
                </select>
              </div>

              {/* Date Range Filter */}
              <div className='flex-1'>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Date Range</label>
                <select
                  value={filters.dateRange}
                  onChange={(e) => setFilters({...filters, dateRange: e.target.value})}
                  className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
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
            <div className='flex flex-wrap gap-2 mt-4'>
              {searchQuery && (
                <span className='inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full'>
                  Search: "{searchQuery}"
                  <button onClick={() => setSearchQuery('')} className='ml-1 hover:text-blue-900'>
                    <X className='w-3 h-3' />
                  </button>
                </span>
              )}
              
              {filters.editedStatus !== 'all' && (
                <span className='inline-flex items-center gap-1 bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full'>
                  Status: {filters.editedStatus === 'edited' ? 'Edited' : 'Not Edited'}
                  <button onClick={() => setFilters({...filters, editedStatus: 'all'})} className='ml-1 hover:text-green-900'>
                    <X className='w-3 h-3' />
                  </button>
                </span>
              )}
              
              {filters.dateRange !== 'all' && (
                <span className='inline-flex items-center gap-1 bg-purple-100 text-purple-800 text-xs px-3 py-1 rounded-full'>
                  Date: {filters.dateRange === 'today' ? 'Today' : 
                         filters.dateRange === 'tomorrow' ? 'Tomorrow' :
                         filters.dateRange === 'week' ? 'Last 7 Days' :
                         filters.dateRange === '15days' ? 'Last 15 Days' :
                         filters.dateRange === 'month' ? 'Last 30 Days' : filters.dateRange}
                  <button onClick={() => setFilters({...filters, dateRange: 'all'})} className='ml-1 hover:text-purple-900'>
                    <X className='w-3 h-3' />
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
          Total: {history.length}
        </span>
        <span className='px-2 sm:px-3 py-1 bg-green-50 text-green-700 rounded-full whitespace-nowrap'>
          Edited: {history.filter(h => h.isEdited).length}
        </span>
        <span className='px-2 sm:px-3 py-1 bg-gray-100 text-gray-700 rounded-full whitespace-nowrap'>
          Not Edited: {history.filter(h => !h.isEdited).length}
        </span>
        <span className='px-2 sm:px-3 py-1 bg-purple-50 text-purple-700 rounded-full whitespace-nowrap'>
          Showing: {filteredHistory.length}
        </span>
      </div>

      {/* History Table */}
    <div className='bg-white border rounded-lg text-xs sm:text-sm max-h-[70vh] sm:max-h-[80vh] min-h-[40vh] sm:min-h-[50vh] overflow-y-auto overflow-x-auto'>


  {/* Desktop Header */}
  <div className='hidden lg:grid grid-cols-[0.5fr_2fr_1fr_2fr_1.5fr_0.5fr_1fr] gap-1 py-3 px-4 sm:px-6 border-b bg-gray-50 sticky top-0 z-10'>
    <p className='font-medium'>#</p>
    <p className='font-medium'>Patient</p>
    <p className='font-medium'>Patient ID</p>
    <p className='font-medium'>Diagnosis</p>
    <p className='font-medium'>Date & Time</p>
    <p className='font-medium'>Fees</p>
    <p className='font-medium'>Action</p>
  </div>

  {loading ? (
    //  Loading Skeleton
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
              <div className='flex gap-2'>
                <div className='h-6 bg-gray-200 rounded w-16'></div>
                <div className='h-6 bg-gray-200 rounded w-12'></div>
              </div>
              <div className='h-4 bg-gray-200 rounded w-20'></div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Skeleton */}
      <div className='hidden lg:block'>
        {[...Array(8)].map((_, i) => (
          <div key={i} className='grid grid-cols-[0.5fr_2fr_1fr_2fr_1.5fr_0.5fr_1fr] gap-1 py-4 px-6 border-b animate-pulse'>
            <div className='h-4 bg-gray-200 rounded w-6'></div>
            <div className='flex items-center gap-2'>
              <div className='w-10 h-10 bg-gray-200 rounded-full'></div>
              <div className='h-4 bg-gray-200 rounded w-32'></div>
            </div>
            <div className='h-4 bg-gray-200 rounded w-20'></div>
            <div className='h-4 bg-gray-200 rounded w-40'></div>
            <div className='h-4 bg-gray-200 rounded w-36'></div>
            <div className='h-4 bg-gray-200 rounded w-12'></div>
            <div className='h-4 bg-gray-200 rounded w-20'></div>
          </div>
        ))}
      </div>
    </>
  ) : filteredHistory.length === 0 ? (
    <div className='py-12 sm:py-16 text-center px-4'>
      <div className='mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3 sm:mb-4'>
        <Search className='w-6 h-6 sm:w-8 sm:h-8 text-gray-400' />
      </div>
      <h3 className='text-base sm:text-lg font-medium text-gray-700 mb-2'>
        No records found
      </h3>
      <p className='text-xs sm:text-sm text-gray-500'>
        {searchQuery ? 'Try adjusting your search or filters' : 'No patient history available'}
      </p>

      {(searchQuery || filters.editedStatus !== 'all' || filters.dateRange !== 'all') && (
        <button
          onClick={clearFilters}
          className='mt-3 sm:mt-4 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-blue-600 hover:text-blue-800 font-medium'
        >
          Clear all filters
        </button>
      )}
    </div>
  ) : (
    filteredHistory.map((item, index) => (
      <div
        key={item._id || index}
        className='flex flex-col lg:grid lg:grid-cols-[0.5fr_2fr_1fr_2fr_1.5fr_0.5fr_1fr] gap-2 lg:gap-1 items-start lg:items-center text-gray-500 py-3 sm:py-4 px-3 sm:px-4 lg:px-6 border-b hover:bg-gray-50'
      >
        {/* Mobile Card Layout */}
        <div className='lg:hidden w-full'>
          <div className='flex items-start gap-3 mb-3'>
            <img className='w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover' src={item.userData.image} alt=''/>
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

          <div className="inline-flex items-center bg-purple-100 text-purple-700 text-xs px-2 py-1 mb-2 rounded-md">
            {item.diagnosis || 'N/A'}
          </div>

          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              {item.isEdited && (
                <span className='text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded'>
                  Edited
                </span>
              )}
              <span className='text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded'>
                {currency} {item.amount}
              </span>
            </div>
            <button
              onClick={() => handleViewDetails(item)}
              className='text-xs font-medium text-blue-600 hover:text-blue-800'
            >
              View Details
            </button>
          </div>
        </div>

        {/* Desktop Grid Layout */}
        <p className='hidden lg:block'>{index + 1}</p>
        <div className='hidden lg:flex items-center gap-2'>
          <img
            className='w-8 sm:w-9 md:w-10 h-8 sm:h-9 md:h-10 rounded-full object-cover'
            src={item.userData.image}
            alt=''
          />
          <p className='truncate'>{item.userData.name}</p>
        </div>
        <p className='hidden lg:block truncate'>{item.userData.patientId}</p>
        <div className='hidden lg:block'>
          <span className="inline-flex items-center bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-md whitespace-nowrap max-w-none sm:max-w-[180px] sm:whitespace-normal sm:break-words">
            {item.diagnosis || 'N/A'}
          </span>
          {item.isEdited && (
            <span className='ml-1 text-xs text-gray-700'>✓</span>
          )}
        </div>
        <p className='hidden lg:block text-xs xl:text-sm'>
          {slotDateFormat(item.slotDate)}, {item.slotTime}
        </p>
        <p className='hidden lg:block'>
          {currency} {item.amount}
        </p>
        <p
          onClick={() => handleViewDetails(item)}
          className='hidden lg:block text-blue-600 cursor-pointer hover:text-blue-800 font-medium'
        >
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

export default PatientHistory;
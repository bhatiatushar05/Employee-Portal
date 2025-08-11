import React, { useState, useEffect } from 'react';
import { Users, UserPlus, QrCode, Clock, MapPin, Phone, Mail, Building, CheckCircle, XCircle, Download } from 'lucide-react';

const VisitorManagement = ({ user }) => {
  const [visitors, setVisitors] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedVisitor, setSelectedVisitor] = useState(null);
  const [showQRCode, setShowQRCode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    purpose: '',
    hostEmployee: user?.fullName || '',
    vehicleNumber: '',
    idProof: ''
  });

  // Load visitors from localStorage
  useEffect(() => {
    const savedVisitors = JSON.parse(localStorage.getItem('visitorRecords') || '[]');
    setVisitors(savedVisitors);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const generateQRCode = (visitorData) => {
    // Simple QR code data - in real implementation, use a QR library
    const qrData = {
      visitorId: visitorData.id,
      name: visitorData.name,
      company: visitorData.company,
      checkInTime: visitorData.checkInTime,
      validUntil: visitorData.validUntil
    };
    return `data:text/plain;base64,${btoa(JSON.stringify(qrData))}`;
  };

  const handleCheckIn = () => {
    if (!formData.name || !formData.phone || !formData.purpose) {
      alert('Please fill in all required fields');
      return;
    }

    const now = new Date();
    const validUntil = new Date(now.getTime() + 24 * 60 * 60 * 1000); // Valid for 24 hours

    const newVisitor = {
      id: Date.now(),
      ...formData,
      checkInTime: now.toLocaleString(),
      checkOutTime: null,
      status: 'checked-in',
      validUntil: validUntil.toLocaleString(),
      qrCode: '', // Will be generated
      createdBy: user.email
    };

    newVisitor.qrCode = generateQRCode(newVisitor);

    const updatedVisitors = [newVisitor, ...visitors];
    setVisitors(updatedVisitors);
    localStorage.setItem('visitorRecords', JSON.stringify(updatedVisitors));

    setSelectedVisitor(newVisitor);
    setShowQRCode(true);
    setShowAddForm(false);
    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      purpose: '',
      hostEmployee: user?.fullName || '',
      vehicleNumber: '',
      idProof: ''
    });
  };

  const handleCheckOut = (visitorId) => {
    const updatedVisitors = visitors.map(visitor =>
      visitor.id === visitorId
        ? { ...visitor, checkOutTime: new Date().toLocaleString(), status: 'checked-out' }
        : visitor
    );
    setVisitors(updatedVisitors);
    localStorage.setItem('visitorRecords', JSON.stringify(updatedVisitors));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'checked-in': return 'bg-green-100 text-green-800';
      case 'checked-out': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTodayVisitors = () => {
    const today = new Date().toDateString();
    return visitors.filter(visitor => 
      new Date(visitor.checkInTime).toDateString() === today
    );
  };

  const getActiveVisitors = () => {
    return visitors.filter(visitor => visitor.status === 'checked-in');
  };

  const downloadQRCode = (visitor) => {
    // Create a simple text file with visitor info
    const visitorInfo = `
Visitor Pass - ${visitor.name}
Company: ${visitor.company}
Purpose: ${visitor.purpose}
Host: ${visitor.hostEmployee}
Check-in: ${visitor.checkInTime}
Valid Until: ${visitor.validUntil}
Visitor ID: ${visitor.id}
    `;
    
    const blob = new Blob([visitorInfo], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `visitor-pass-${visitor.name.replace(/\s+/g, '-')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl shadow-lg">
                <Users size={24} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Visitor Management</h1>
                <p className="text-gray-600">Manage visitor check-ins and issue QR passes</p>
              </div>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <div className="flex items-center gap-2">
                <UserPlus size={20} />
                Add Visitor
              </div>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 text-green-600 rounded-xl">
                <Users size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Today's Visitors</h3>
                <p className="text-2xl font-bold text-green-600">{getTodayVisitors().length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                <CheckCircle size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Currently In</h3>
                <p className="text-2xl font-bold text-blue-600">{getActiveVisitors().length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 text-purple-600 rounded-xl">
                <QrCode size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Total Visitors</h3>
                <p className="text-2xl font-bold text-purple-600">{visitors.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 text-orange-600 rounded-xl">
                <Clock size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Current Time</h3>
                <p className="text-lg font-bold text-orange-600">
                  {new Date().toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Visitor List */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900">Visitor Records</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Visitor</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purpose</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Host</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check In</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {visitors.length > 0 ? (
                  visitors.map((visitor, index) => (
                    <tr key={visitor.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{visitor.name}</div>
                          <div className="text-sm text-gray-500">{visitor.phone}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {visitor.company}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {visitor.purpose}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {visitor.hostEmployee}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {visitor.checkInTime}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(visitor.status)}`}>
                          {visitor.status === 'checked-in' ? 'In Building' : 'Checked Out'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        {visitor.status === 'checked-in' && (
                          <button
                            onClick={() => handleCheckOut(visitor.id)}
                            className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition-colors"
                          >
                            Check Out
                          </button>
                        )}
                        <button
                          onClick={() => downloadQRCode(visitor)}
                          className="bg-purple-600 text-white px-3 py-1 rounded-lg hover:bg-purple-700 transition-colors"
                        >
                          <QrCode size={14} className="inline mr-1" />
                          Pass
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                      No visitors found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Visitor Form Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">Add New Visitor</h2>
              </div>
              
              <div className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company/Organization
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Purpose of Visit *
                    </label>
                    <textarea
                      name="purpose"
                      value={formData.purpose}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Host Employee
                    </label>
                    <input
                      type="text"
                      name="hostEmployee"
                      value={formData.hostEmployee}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Vehicle Number
                    </label>
                    <input
                      type="text"
                      name="vehicleNumber"
                      value={formData.vehicleNumber}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ID Proof Type
                    </label>
                    <select
                      name="idProof"
                      value={formData.idProof}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    >
                      <option value="">Select ID Proof</option>
                      <option value="driving-license">Driving License</option>
                      <option value="aadhar">Aadhar Card</option>
                      <option value="pan">PAN Card</option>
                      <option value="passport">Passport</option>
                      <option value="voter-id">Voter ID</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex gap-4 mt-8">
                  <button
                    onClick={handleCheckIn}
                    className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-6 rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <CheckCircle size={20} />
                      Check In & Generate Pass
                    </div>
                  </button>
                  
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="px-6 py-3 bg-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* QR Code Modal */}
        {showQRCode && selectedVisitor && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
              <div className="p-6 border-b border-gray-200 text-center">
                <QrCode size={48} className="mx-auto text-purple-600 mb-4" />
                <h2 className="text-2xl font-bold text-gray-900">Visitor Pass Generated</h2>
                <p className="text-gray-600 mt-2">Pass for {selectedVisitor.name}</p>
              </div>
              
              <div className="p-6 text-center">
                <div className="bg-gray-100 p-8 rounded-xl mb-6">
                  <QrCode size={120} className="mx-auto text-purple-600 mb-4" />
                  <p className="text-sm text-gray-600">
                    Visitor ID: {selectedVisitor.id}
                  </p>
                  <p className="text-sm text-gray-600">
                    Valid until: {selectedVisitor.validUntil}
                  </p>
                </div>
                
                <div className="space-y-2 text-sm text-gray-600 mb-6">
                  <p><strong>Name:</strong> {selectedVisitor.name}</p>
                  <p><strong>Company:</strong> {selectedVisitor.company}</p>
                  <p><strong>Purpose:</strong> {selectedVisitor.purpose}</p>
                  <p><strong>Host:</strong> {selectedVisitor.hostEmployee}</p>
                </div>
                
                <div className="flex gap-4">
                  <button
                    onClick={() => downloadQRCode(selectedVisitor)}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Download size={20} />
                      Download Pass
                    </div>
                  </button>
                  
                  <button
                    onClick={() => {
                      setShowQRCode(false);
                      setSelectedVisitor(null);
                    }}
                    className="px-6 py-3 bg-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-400 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VisitorManagement;
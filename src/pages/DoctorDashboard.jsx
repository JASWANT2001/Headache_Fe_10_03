import React from 'react';

export default function DoctorDashboard({ user, onLogout }) {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">👨‍⚕️ Doctor Dashboard</h1>
            <p className="text-gray-600 mt-2">Welcome, {user?.username}!</p>
          </div>
          <button
            onClick={onLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
          >
            Logout
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">My Patients</p>
            <p className="text-4xl font-bold text-blue-600">12</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Total Assessments</p>
            <p className="text-4xl font-bold text-green-600">28</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg text-left">
            <span className="block text-2xl">➕ Add New Patient</span>
            <span className="text-sm mt-2">Create a new patient record</span>
          </button>
          <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-lg text-left">
            <span className="block text-2xl">👁️ View My Patients</span>
            <span className="text-sm mt-2">See all your patients</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Coming Soon</h2>
          <p className="text-gray-600">
            Patient management features will be available here. You can create patients, run assessments, and view results.
          </p>
        </div>
      </div>
    </div>
  );
}

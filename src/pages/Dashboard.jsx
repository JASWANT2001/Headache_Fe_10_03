import React, { useState, useEffect } from 'react';
import { dashboardAPI, userAPI } from '../api';
import CreateUserForm from '../components/CreateUserForm';
import PatientCreation from './PatientCreation';
import HeadacheAssessment from './Diagnosis';
import Patients from '../components/Patients';
import DoctorsList from '../components/DoctorsList';
import AllPatients from '../components/AllPatients';
import ResetPassword from '../components/Resetpassword';

import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip
} from "recharts";

import Sidebar from "../components/Sidebar";

import {
  LayoutDashboard,
  Users,
  UserPlus,
  Activity,
  Bell,
  Filter,
  Download,
  MoreVertical,
  CheckCircle,
  Menu,
  X
} from "lucide-react";

export default function Dashboard({ user, onLogout }) {

  const [stats, setStats] = useState(null);
  const [topProviders, setTopProviders] = useState([]);
  const [recentPatients, setRecentPatients] = useState([]);
  const [recentAssessments, setRecentAssessments] = useState([]);
  const [users, setUsers] = useState([]);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [showPasswordSuccess, setShowPasswordSuccess] = useState(false);

  const [doctorStats, setDoctorStats] = useState(null);

  const [viewedUserId, setViewedUserId] = useState(null);
  const [patientData, setPatientData] = useState(null);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({ username: '', email: '', phoneNumber: '', role: '' });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const isSuperAdmin = user?.role === 'admin';
  const [currentView, setCurrentView] = useState('dashboard');


  useEffect(() => {
    if (currentView === "dashboard") {
      if (isSuperAdmin) {
        loadAdminDashboard();
      } else {
        loadDoctorDashboard();
      }
    }
  }, [currentView, isSuperAdmin]);

  useEffect(() => {
    const handleClickOutside = () => {
      setShowProfileDropdown(false);
    };
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [currentView]);


  const loadAdminDashboard = async () => {
    try {
      const statsRes = await dashboardAPI.getStats();
      const { overview, topProviders, recentPatients } = statsRes.data.data;
      setStats(overview);
      setTopProviders(topProviders);
      setRecentPatients(recentPatients);
      const usersRes = await userAPI.getAllUsers();
      setUsers(usersRes.data.data);
    } catch (error) {
      console.error('Error loading admin dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadDoctorDashboard = async () => {
    try {
      const statsRes = await dashboardAPI.getDoctorStats();
      setDoctorStats(statsRes.data.data);
      setRecentAssessments([]);
    } catch (error) {
      console.error('Error loading doctor stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const patientActivityData = [
    { day: "Mon", assessments: 2 },
    { day: "Tue", assessments: 4 },
    { day: "Wed", assessments: 3 },
    { day: "Thu", assessments: 6 },
    { day: "Fri", assessments: 5 },
    { day: "Sat", assessments: 2 },
    { day: "Sun", assessments: 1 }
  ];


  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-cyan-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (currentView === 'createPatient') {
    return (
      <PatientCreation
        setCurrentView={setCurrentView}
        onBack={() => setCurrentView('dashboard')}
        doctorEmail={user?.email}
        onStartDiagnosis={(patientData) => {
          setPatientData(patientData);
          setCurrentView('diagnosis');
        }}
      />
    );
  }

  if (currentView === 'diagnosis') {
    return <HeadacheAssessment patientInfo={patientData} doctorEmail={user?.email} />;
  }

  if (currentView === 'doctors') {
    return <DoctorsList setCurrentView={setCurrentView} />;
  }

  if (currentView === 'patients') {
    return <Patients setCurrentView={setCurrentView} />;
  }

  if (currentView === 'allPatients') {
    return <AllPatients setCurrentView={setCurrentView} />;
  }


  // ════════════════════════════════════════════════════════════════════════════
  // DOCTOR DASHBOARD
  // ════════════════════════════════════════════════════════════════════════════
  if (!isSuperAdmin) {
    return (
      <div className="flex min-h-screen bg-[#f6f8fc]">

        {mobileSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-30 lg:hidden"
            onClick={() => setMobileSidebarOpen(false)}
          />
        )}

        <div
          className={`
            fixed lg:static inset-y-0 left-0 z-40
            transform transition-transform duration-300 ease-in-out
            ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            lg:translate-x-0
          `}
        >
          <Sidebar
            setCurrentView={setCurrentView}
            active={currentView}
            role="doctor"
          />
        </div>

        <div className="flex-1 flex flex-col min-w-0">

          {/* HEADER */}
          <div className="flex justify-between items-center px-4 sm:px-6 lg:px-10 py-4 sm:py-6 bg-white border-b">

            <div className="flex items-center gap-3">
              <button
                className="lg:hidden text-gray-600 hover:text-gray-900 p-1"
                onClick={() => setMobileSidebarOpen(true)}
              >
                <Menu size={22} />
              </button>

              <div>
                <h1 className="text-lg sm:text-2xl font-bold text-gray-800">
                  Doctor Dashboard
                </h1>
                <p className="text-gray-500 text-xs sm:text-sm hidden sm:block">
                  Overview of your patient activity
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-6">

              <button className="text-gray-600 hover:text-gray-900">
                <Bell size={20} />
              </button>

              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowProfileDropdown(!showProfileDropdown);
                  }}
                  className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-2 sm:px-3 py-1.5 rounded-lg"
                >
                  <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold">
                    {user?.username?.charAt(0)}
                  </div>
                  <span className="text-sm font-medium text-gray-700 hidden sm:inline">
                    {user?.username}
                  </span>
                </button>

                {showProfileDropdown && (
                  <div className="absolute right-0 mt-2 w-44 bg-white border rounded-lg shadow-lg z-50">
                    <button
                      onClick={() => {
                        setShowResetPassword(true);
                        setShowProfileDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      Reset Password
                    </button>
                    <button
                      onClick={onLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* CONTENT */}
          <div className="p-4 sm:p-6 lg:p-10">

            {/* STATS GRID */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-10">

              <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border flex justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-500">My Patients</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
                    {doctorStats?.myPatients || 0}
                  </p>
                  <p className="text-green-600 text-xs mt-1">Active cases</p>
                </div>
                <div className="bg-blue-100 p-2 sm:p-3 rounded-lg self-start">
                  <Users size={18} className="text-blue-600" />
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border flex justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-500">Assessments Done</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
                    {doctorStats?.assessments || 0}
                  </p>
                  <p className="text-green-600 text-xs mt-1">Total completed</p>
                </div>
                <div className="bg-purple-100 p-2 sm:p-3 rounded-lg self-start">
                  <Activity size={18} className="text-purple-600" />
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border flex justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-500">Account Status</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">Active</p>
                  <p className="text-gray-500 text-xs mt-1">System verified</p>
                </div>
                <div className="bg-green-100 p-2 sm:p-3 rounded-lg self-start">
                  <CheckCircle size={18} className="text-green-600" />
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border flex justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-500">Last Login</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">Today</p>
                  <p className="text-gray-500 text-xs mt-1">Recent activity</p>
                </div>
                <div className="bg-orange-100 p-2 sm:p-3 rounded-lg self-start">
                  <LayoutDashboard size={18} className="text-orange-600" />
                </div>
              </div>

            </div>

            {/* Patient Activity Chart */}
            <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6 mb-6 sm:mb-10">
              <h3 className="font-semibold text-gray-800 mb-4">Patient Activity</h3>
              <div className="h-48 sm:h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={patientActivityData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="day" stroke="#94a3b8" tick={{ fontSize: 12 }} />
                    <YAxis allowDecimals={false} stroke="#94a3b8" tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="assessments"
                      stroke="#2563eb"
                      strokeWidth={3}
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        </div>

        {showResetPassword && (
          <ResetPassword
            onClose={() => setShowResetPassword(false)}
            onSuccess={() => {
              setShowResetPassword(false);
              setShowPasswordSuccess(true);
            }}
          />
        )}

        {showPasswordSuccess && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-xl shadow-xl p-6 sm:p-8 w-full max-w-sm text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <CheckCircle className="text-green-600" size={28} />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Password Updated</h3>
              <p className="text-gray-500 text-sm mt-2">
                Your password has been successfully changed.
              </p>
              <button
                onClick={() => setShowPasswordSuccess(false)}
                className="mt-6 w-full bg-gray-900 hover:bg-gray-800 text-white py-2 rounded-lg"
              >
                Continue
              </button>
            </div>
          </div>
        )}

      </div>
    );
  }


  // ════════════════════════════════════════════════════════════════════════════
  // SUPER ADMIN DASHBOARD
  // ════════════════════════════════════════════════════════════════════════════
  return (
    <div className="flex min-h-screen bg-[#f6f8fc]">

      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      <div
        className={`
          fixed lg:static inset-y-0 left-0 z-40
          transform transition-transform duration-300 ease-in-out
          ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        <Sidebar
          setCurrentView={setCurrentView}
          active={currentView}
          role="admin"
        />
      </div>

      <div className="flex-1 flex flex-col min-w-0">

        {/* HEADER */}
        <div className="flex justify-between items-center px-4 sm:px-6 lg:px-10 py-4 sm:py-6 bg-white border-b">

          <div className="flex items-center gap-3">
            <button
              className="lg:hidden text-gray-600 hover:text-gray-900 p-1"
              onClick={() => setMobileSidebarOpen(true)}
            >
              <Menu size={22} />
            </button>

            <div>
              <h1 className="text-lg sm:text-2xl font-bold text-gray-800">Dashboard</h1>
              <p className="text-gray-500 text-xs sm:text-sm hidden sm:block">
                Overview of your healthcare platform
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-6">
            <button className="text-gray-600 hover:text-gray-900">
              <Bell size={20} />
            </button>
            <div className="hidden sm:flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-lg">
              <span className="font-medium text-gray-700">{user?.username}</span>
            </div>
            <button
              onClick={onLogout}
              className="px-3 sm:px-4 py-2 bg-gray-900 text-white rounded-lg text-xs sm:text-sm whitespace-nowrap"
            >
              Logout
            </button>
          </div>

        </div>

        {/* CONTENT */}
        <div className="p-4 sm:p-6 lg:p-10">

          {/* METRICS */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-10">

            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border flex justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-500">Total Doctors</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
                  {stats?.totalUsers || 0}
                </p>
                <p className="text-green-600 text-xs mt-1">+4% vs last month</p>
              </div>
              <div className="bg-blue-100 p-2 sm:p-3 rounded-lg self-start">
                <Users size={18} className="text-blue-600" />
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border flex justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-500">Total Patients</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
                  {stats?.totalPatients || 0}
                </p>
                <p className="text-green-600 text-xs mt-1">+12% vs last month</p>
              </div>
              <div className="bg-purple-100 p-2 sm:p-3 rounded-lg self-start">
                <Users size={18} className="text-purple-600" />
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border flex justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-500">Active Doctors</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
                  {stats?.activeProviders || 0}
                </p>
                <p className="text-gray-500 text-xs mt-1">Past 7 days activity</p>
              </div>
              <div className="bg-green-100 p-2 sm:p-3 rounded-lg self-start">
                <CheckCircle size={18} className="text-green-600" />
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border flex justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-500">Avg Patients / Dr</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
                  {stats?.avgPatientsPerUser || 0}
                </p>
                <p className="text-red-500 text-xs mt-1">-2% system load balancing</p>
              </div>
              <div className="bg-orange-100 p-2 sm:p-3 rounded-lg self-start">
                <Activity size={18} className="text-orange-600" />
              </div>
            </div>

          </div>

          {/* PROVIDERS TABLE */}
          <div className="bg-white rounded-xl shadow-sm border">

            <div className="p-4 sm:p-6 border-b flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
              <div>
                <h2 className="font-semibold text-gray-800">Top Performing Providers</h2>
                <p className="text-xs text-gray-500">Detailed breakdown of medical staff performance</p>
              </div>

              {/* Filter & Export — hidden on mobile, visible on sm+ */}
              <div className="hidden sm:flex gap-3">
                <button className="flex items-center gap-2 px-4 py-2 border rounded-lg text-sm">
                  <Filter size={14} />
                  Filter
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">
                  <Download size={14} />
                  Export
                </button>
              </div>
            </div>

            {/* Mobile card list */}
            <div className="sm:hidden divide-y">
              {users.map(provider => (
                <div key={provider._id} className="flex items-center justify-between px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center font-semibold text-blue-600 shrink-0">
                      {provider.username?.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">{provider.username}</p>
                      <p className="text-xs text-gray-500">Neurology</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-700">{provider.numberOfPatients || 0}</p>
                    <p className="text-xs text-gray-400">patients</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop table — hidden on mobile */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-sm min-w-[600px]">

                <thead className="text-gray-500 border-b bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left">Doctor</th>
                    <th className="px-6 py-4 text-left">Department</th>
                    <th className="px-6 py-4 text-left">Patients Treated</th>
                    <th className="px-6 py-4 text-left">Status</th>
                    <th className="px-6 py-4 text-left">Last Active</th>
                    <th className="px-6 py-4"></th>
                  </tr>
                </thead>

                <tbody>
                  {users.map(provider => (
                    <tr key={provider._id} className="border-b hover:bg-gray-50">

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center font-semibold text-blue-600 shrink-0">
                            {provider.username?.charAt(0)}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-800 text-sm">{provider.username}</div>
                            <div className="text-xs text-gray-500">{provider.email}</div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-gray-600 text-sm">Neurology</td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-gray-700 text-sm">
                            {provider.numberOfPatients || 0}
                          </span>
                          <div className="w-24 bg-gray-200 h-2 rounded-full">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${Math.min(provider.numberOfPatients || 0, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                          Active
                        </span>
                      </td>

                      <td className="px-6 py-4 text-gray-600">—</td>

                      <td className="px-6 py-4 text-gray-400">
                        <button><MoreVertical size={18} /></button>
                      </td>

                    </tr>
                  ))}
                </tbody>

              </table>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
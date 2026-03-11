import React, { useState, useEffect } from 'react';
import { dashboardAPI, userAPI } from '../api';
import CreateUserForm from '../components/CreateUserForm';

export default function AdminDashboard({ user, onLogout }) {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(true);

  // View state: which user's details are expanded
  const [viewedUserId, setViewedUserId] = useState(null);

  // Delete confirmation state
  const [deleteTarget, setDeleteTarget] = useState(null); // user object to delete
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Edit state
  const [editingUser, setEditingUser] = useState(null); // user object being edited
  const [editForm, setEditForm] = useState({ username: '', email: '', phoneNumber: '', role: '' });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const statsRes = await dashboardAPI.getStats();
      setStats(statsRes.data.data.overview);

      const usersRes = await userAPI.getAllUsers();
      setUsers(usersRes.data.data);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  // ─── VIEW ────────────────────────────────────────────────────────────────────
  const handleViewToggle = (userId) => {
    setViewedUserId(prev => (prev === userId ? null : userId));
    // Close edit form if switching rows
    setEditingUser(null);
  };

  // ─── DELETE ──────────────────────────────────────────────────────────────────
  const handleDeleteClick = (u) => {
    setDeleteTarget(u);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await userAPI.deleteUser(deleteTarget._id);
      setUsers(prev => prev.filter(u => u._id !== deleteTarget._id));
      if (viewedUserId === deleteTarget._id) setViewedUserId(null);
      setDeleteTarget(null);
    } catch (error) {
      console.error('Delete failed:', error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteTarget(null);
  };

  // ─── EDIT ────────────────────────────────────────────────────────────────────
  const handleEditClick = (u) => {
    setEditingUser(u);
    setEditForm({
      username: u.username || '',
      email: u.email || '',
      phoneNumber: u.phoneNumber || '',
      role: u.role || 'doctor',
    });
    setEditError('');
    // Expand the detail view for this user
    setViewedUserId(u._id);
  };

  const handleEditChange = (e) => {
    setEditForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    setEditError('');
    try {
      const res = await userAPI.updateUser(editingUser._id, editForm);
      const updated = res.data.data || res.data.user;
      setUsers(prev => prev.map(u => (u._id === editingUser._id ? { ...u, ...editForm } : u)));
      setEditingUser(null);
    } catch (error) {
      setEditError(error?.response?.data?.message || 'Update failed. Please try again.');
    } finally {
      setEditLoading(false);
    }
  };

  const handleEditCancel = () => {
    setEditingUser(null);
    setEditError('');
  };

  // ─── RENDER ──────────────────────────────────────────────────────────────────
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">📊 Admin Dashboard</h1>
          <button
            onClick={onLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
          >
            Logout
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Total Users</p>
            <p className="text-4xl font-bold text-blue-600">{stats?.totalUsers || 0}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Total Patients</p>
            <p className="text-4xl font-bold text-green-600">{stats?.totalPatients || 0}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Total Assessments</p>
            <p className="text-4xl font-bold text-purple-600">{stats?.totalAssessments || 0}</p>
          </div>
        </div>

        {/* Create User Button */}
        <div className="mb-8">
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg"
          >
            {showCreateForm ? '✕ Cancel' : '➕ Create New User'}
          </button>
        </div>

        {/* Create User Form */}
        {showCreateForm && (
          <CreateUserForm onSuccess={() => { setShowCreateForm(false); loadDashboard(); }} />
        )}

        {/* Users List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">All Users</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Phone</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Role</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <React.Fragment key={u._id}>

                    {/* ── Main Row ── */}
                    <tr className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">{u.username}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{u.email}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{u.phoneNumber}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{u.role}</td>
                      <td className="px-6 py-4 text-sm flex gap-3 items-center">
                        {/* View */}
                        <button
                          onClick={() => handleViewToggle(u._id)}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          {viewedUserId === u._id ? '▲ Hide' : '👁 View'}
                        </button>

                        {/* Edit */}
                        <button
                          onClick={() => handleEditClick(u)}
                          className="text-yellow-600 hover:text-yellow-800 font-medium"
                        >
                          ✏️ Edit
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => handleDeleteClick(u)}
                          className="text-red-600 hover:text-red-800 font-medium"
                        >
                          🗑 Delete
                        </button>
                      </td>
                    </tr>

                    {/* ── Detail / Edit Panel (expanded row) ── */}
                    {viewedUserId === u._id && (
                      <tr className="bg-blue-50">
                        <td colSpan={5} className="px-8 py-6">

                          {editingUser?._id === u._id ? (
                            /* ── EDIT FORM ── */
                            <form onSubmit={handleEditSubmit}>
                              <h3 className="text-lg font-bold text-gray-800 mb-4">Edit User</h3>
                              {editError && (
                                <p className="text-red-600 text-sm mb-3">{editError}</p>
                              )}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-xs font-semibold text-gray-600 mb-1">Name</label>
                                  <input
                                    name="username"
                                    value={editForm.username}
                                    onChange={handleEditChange}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    required
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-semibold text-gray-600 mb-1">Email</label>
                                  <input
                                    name="email"
                                    type="email"
                                    value={editForm.email}
                                    onChange={handleEditChange}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    required
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-semibold text-gray-600 mb-1">Phone Number</label>
                                  <input
                                    name="phoneNumber"
                                    value={editForm.phoneNumber}
                                    onChange={handleEditChange}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-semibold text-gray-600 mb-1">Role</label>
                                  <select
                                    name="role"
                                    value={editForm.role}
                                    onChange={handleEditChange}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                  >
                                    <option value="doctor">Doctor</option>
                                    <option value="nurse">Nurse</option>
                                    <option value="staff">Staff</option>
                                  </select>
                                </div>
                              </div>
                              <div className="flex gap-3 mt-4">
                                <button
                                  type="submit"
                                  disabled={editLoading}
                                  className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-semibold px-5 py-2 rounded-lg text-sm"
                                >
                                  {editLoading ? 'Saving...' : '✓ Save Changes'}
                                </button>
                                <button
                                  type="button"
                                  onClick={handleEditCancel}
                                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-5 py-2 rounded-lg text-sm"
                                >
                                  Cancel
                                </button>
                              </div>
                            </form>
                          ) : (
                            /* ── VIEW DETAILS ── */
                            <div>
                              <h3 className="text-lg font-bold text-gray-800 mb-3">User Details</h3>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div>
                                  <p className="text-xs font-semibold text-gray-500 uppercase">Name</p>
                                  <p className="text-sm text-gray-900 mt-1">{u.username}</p>
                                </div>
                                <div>
                                  <p className="text-xs font-semibold text-gray-500 uppercase">Email</p>
                                  <p className="text-sm text-gray-900 mt-1">{u.email}</p>
                                </div>
                                <div>
                                  <p className="text-xs font-semibold text-gray-500 uppercase">Phone</p>
                                  <p className="text-sm text-gray-900 mt-1">{u.phoneNumber || '—'}</p>
                                </div>
                                <div>
                                  <p className="text-xs font-semibold text-gray-500 uppercase">Role</p>
                                  <p className="text-sm text-gray-900 mt-1 capitalize">{u.role}</p>
                                </div>
                                {/* <div>
                                  <p className="text-xs font-semibold text-gray-500 uppercase">User ID</p>
                                  <p className="text-sm text-gray-900 mt-1 font-mono">{u.userId || u._id}</p>
                                </div>
                                <div>
                                  <p className="text-xs font-semibold text-gray-500 uppercase">Created At</p>
                                  <p className="text-sm text-gray-900 mt-1">
                                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}
                                  </p>
                                </div> */}
                              </div>
                              <button
                                onClick={() => handleEditClick(u)}
                                className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-semibold px-4 py-2 rounded-lg"
                              >
                                ✏️ Edit This User
                              </button>
                            </div>
                          )}

                        </td>
                      </tr>
                    )}

                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── DELETE CONFIRMATION MODAL ── */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4">
            <div className="text-center">
              <div className="text-5xl mb-4">⚠️</div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Delete User?</h2>
              <p className="text-gray-600 text-sm mb-1">
                You are about to permanently delete:
              </p>
              <p className="font-semibold text-gray-900 mb-1">{deleteTarget.username}</p>
              <p className="text-gray-500 text-sm mb-6">{deleteTarget.email}</p>
              <p className="text-red-600 text-xs mb-6">This action cannot be undone.</p>

              <div className="flex gap-3">
                <button
                  onClick={handleDeleteCancel}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  disabled={deleteLoading}
                  className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-semibold py-2 rounded-lg"
                >
                  {deleteLoading ? 'Deleting...' : 'Yes, Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
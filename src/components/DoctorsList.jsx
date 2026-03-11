import React, { useState, useEffect } from "react";
import { userAPI } from "../api";
import CreateUserForm from "./CreateUserForm";
import Sidebar from "./Sidebar";
import { Search, Eye, Pencil, Trash2, Plus, Menu, ChevronDown, ChevronUp } from "lucide-react";

export default function DoctorsList({ setCurrentView }) {

    const [search, setSearch] = useState("");
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showCreateForm, setShowCreateForm] = useState(false);
    const [viewedUserId, setViewedUserId] = useState(null);
    const [editingUser, setEditingUser] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

    const [editForm, setEditForm] = useState({
        username: "",
        email: "",
        phoneNumber: "",
        location: "",
        instituteName: "",
        instituteType: "",
        role: "doctor"
    });

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            const res = await userAPI.getAllUsers();
            setUsers(res.data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (date) => {
        if (!date) return "-";
        return new Date(date).toLocaleDateString();
    };

    const isUserActive = (lastLogin) => {
        if (!lastLogin) return false;
        const diff = (new Date() - new Date(lastLogin)) / (1000 * 60 * 60 * 24);
        return diff <= 7;
    };

    const handleViewToggle = (id) => {
        setEditingUser(null);
        setViewedUserId(viewedUserId === id ? null : id);
    };

    const handleEditClick = (u) => {
        setViewedUserId(u._id);
        setEditingUser(u);
        setEditForm({
            username: u.username || "",
            email: u.email || "",
            phoneNumber: u.phoneNumber || "",
            location: u.location || "",
            instituteName: u.instituteName || "",
            instituteType: u.instituteType || "",
            role: u.role || "doctor"
        });
    };

    const handleEditChange = (e) => {
        setEditForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            await userAPI.updateUser(editingUser._id, editForm);
            setUsers(prev =>
                prev.map(u => u._id === editingUser._id ? { ...u, ...editForm } : u)
            );
            setEditingUser(null);
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteClick = (u) => {
        setDeleteTarget(u);
    };

    const handleDeleteConfirm = async () => {
        try {
            await userAPI.deleteUser(deleteTarget._id);
            setUsers(prev => prev.filter(u => u._id !== deleteTarget._id));
            setDeleteTarget(null);
        } catch (err) {
            console.error(err);
        }
    };

    const filteredUsers = users.filter((u) => {
        const searchText = search.toLowerCase();
        return (
            u.username?.toLowerCase().includes(searchText) ||
            u.email?.toLowerCase().includes(searchText) ||
            u.phoneNumber?.toLowerCase().includes(searchText) ||
            u.location?.toLowerCase().includes(searchText) ||
            u.instituteName?.toLowerCase().includes(searchText)
        );
    });

    if (loading) {
        return <div className="p-10">Loading doctors...</div>;
    }

    return (
        <div className="flex min-h-screen bg-[#f6f8fc]">

            {/* Mobile sidebar overlay */}
            {mobileSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-30 lg:hidden"
                    onClick={() => setMobileSidebarOpen(false)}
                />
            )}

            {/* SIDEBAR */}
            <div className={`
                fixed lg:static inset-y-0 left-0 z-40
                transform transition-transform duration-300 ease-in-out
                ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"}
                lg:translate-x-0
            `}>
                <Sidebar
                    setCurrentView={setCurrentView}
                    active="doctors"
                    role="admin"
                    onClose={() => setMobileSidebarOpen(false)}
                />
            </div>

            {/* MAIN CONTENT */}
            <div className="flex-1 min-w-0 p-4 sm:p-6 lg:p-10">

                {/* HEADER */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
                    <div className="flex items-center gap-3">
                        {/* Mobile hamburger */}
                        <button
                            className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-200"
                            onClick={() => setMobileSidebarOpen(true)}
                        >
                            <Menu size={22} />
                        </button>
                        <div>
                            <h1 className="text-xl sm:text-3xl font-bold">All Doctors</h1>
                            <p className="text-gray-500 text-sm">Manage healthcare providers on the platform</p>
                        </div>
                    </div>

                    <button
                        onClick={() => setShowCreateForm(!showCreateForm)}
                        className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm whitespace-nowrap mt-6 sm:mt-0 self-start sm:self-auto"
                    >
                        <Plus size={16} />
                        <span className="hidden sm:inline">Create New Doctor</span>
                        <span className="sm:hidden">Add Doctor</span>
                    </button>
                </div>

                {/* CREATE FORM */}
                {showCreateForm && (
                    <div className="bg-white p-4 sm:p-6 rounded-xl shadow mb-6">
                        <CreateUserForm
                            onSuccess={() => { setShowCreateForm(false); loadUsers(); }}
                            onCancel={() => setShowCreateForm(false)}
                        />
                    </div>
                )}

                {/* SEARCH */}
                <div className="bg-white p-3 sm:p-4 rounded-xl shadow mb-6 flex items-center gap-3">
                    <Search size={18} className="text-gray-400 shrink-0" />
                    <input
                        placeholder="Search doctors..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full outline-none text-sm"
                    />
                </div>

                {/* ── DESKTOP TABLE (md+) ── */}
                <div className="hidden md:block bg-white rounded-xl shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[800px]">
                            <thead className="bg-gray-50 text-gray-500 text-sm">
                                <tr>
                                    <th className="px-6 py-4 text-left">Doctor</th>
                                    <th className="px-6 py-4 text-left">Contact</th>
                                    <th className="px-6 py-4 text-left">Location</th>
                                    <th className="px-6 py-4 text-left">Created</th>
                                    <th className="px-6 py-4 text-left">Last Active</th>
                                    <th className="px-6 py-4 text-left">Patients</th>
                                    <th className="px-6 py-4 text-left">Status</th>
                                    <th className="px-6 py-4 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map(u => (
                                    <React.Fragment key={u._id}>
                                        <tr className="border-b hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold shrink-0">
                                                        {u.username?.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold">Dr. {u.username}</p>
                                                        <p className="text-xs text-gray-500">{u.instituteType || "Doctor"}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                <p>{u.email}</p>
                                                <p className="text-xs text-gray-400">{u.phoneNumber}</p>
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                <p>{u.location}</p>
                                                <p className="text-xs text-gray-400">{u.instituteName}</p>
                                            </td>
                                            <td className="px-6 py-4 text-sm">{formatDate(u.createdAt)}</td>
                                            <td className="px-6 py-4 text-sm">{formatDate(u.lastLogin)}</td>
                                            <td className="px-6 py-4 text-sm font-semibold">{u.numberOfPatients || 0}</td>
                                            <td className="px-6 py-4">
                                                {isUserActive(u.lastLogin)
                                                    ? <span className="text-green-600 bg-green-100 px-3 py-1 rounded-full text-xs">Active</span>
                                                    : <span className="text-gray-500 bg-gray-100 px-3 py-1 rounded-full text-xs">Inactive</span>
                                                }
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex gap-3">
                                                    <button onClick={() => handleViewToggle(u._id)} className="text-gray-500 hover:text-blue-600">
                                                        <Eye size={18} />
                                                    </button>
                                                    <button onClick={() => handleEditClick(u)} className="text-gray-500 hover:text-yellow-600">
                                                        <Pencil size={18} />
                                                    </button>
                                                    <button onClick={() => handleDeleteClick(u)} className="text-gray-500 hover:text-red-600">
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>

                                        {/* EXPAND PANEL — desktop */}
                                        {viewedUserId === u._id && (
                                            <tr className="bg-gray-50">
                                                <td colSpan={8} className="p-6">
                                                    {editingUser?._id === u._id ? (
                                                        <form onSubmit={handleEditSubmit}>
                                                            <h3 className="font-semibold mb-4">Edit Doctor</h3>
                                                            <div className="grid grid-cols-3 gap-4">
                                                                <input name="username" value={editForm.username} onChange={handleEditChange} placeholder="Username" className="border p-2 rounded" />
                                                                <input name="email" value={editForm.email} onChange={handleEditChange} placeholder="Email" className="border p-2 rounded" />
                                                                <input name="phoneNumber" value={editForm.phoneNumber} onChange={handleEditChange} placeholder="Phone" className="border p-2 rounded" />
                                                                <input name="location" value={editForm.location} onChange={handleEditChange} placeholder="Location" className="border p-2 rounded" />
                                                                <input name="instituteName" value={editForm.instituteName} onChange={handleEditChange} placeholder="Institute Name" className="border p-2 rounded" />
                                                                <input name="instituteType" value={editForm.instituteType} onChange={handleEditChange} placeholder="Institute Type" className="border p-2 rounded" />
                                                            </div>
                                                            <div className="flex gap-3 mt-4">
                                                                <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Save Changes</button>
                                                                <button type="button" onClick={() => setEditingUser(null)} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
                                                            </div>
                                                        </form>
                                                    ) : (
                                                        <div>
                                                            <h3 className="font-semibold mb-3">Doctor Details</h3>
                                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                                <div className="bg-white border rounded-xl p-6 shadow-sm">
                                                                    <h3 className="font-semibold text-gray-800 mb-4">Doctor Profile</h3>
                                                                    <div className="space-y-3 text-sm">
                                                                        <div className="flex justify-between"><span className="text-gray-500">Username</span><span className="font-medium">{u.username}</span></div>
                                                                        <div className="flex justify-between"><span className="text-gray-500">Role</span><span className="font-medium">{u.role}</span></div>
                                                                        <div className="flex justify-between"><span className="text-gray-500">Patients</span><span className="font-medium">{u.numberOfPatients || 0}</span></div>
                                                                        <div className="flex justify-between"><span className="text-gray-500">Created</span><span className="font-medium">{formatDate(u.createdAt)}</span></div>
                                                                    </div>
                                                                </div>
                                                                <div className="bg-white border rounded-xl p-6 shadow-sm">
                                                                    <h3 className="font-semibold text-gray-800 mb-4">Contact Information</h3>
                                                                    <div className="space-y-3 text-sm">
                                                                        <div className="flex justify-between"><span className="text-gray-500">Email</span><span className="font-medium">{u.email}</span></div>
                                                                        <div className="flex justify-between"><span className="text-gray-500">Phone</span><span className="font-medium">{u.phoneNumber}</span></div>
                                                                        <div className="flex justify-between"><span className="text-gray-500">Location</span><span className="font-medium">{u.location}</span></div>
                                                                    </div>
                                                                </div>
                                                                <div className="bg-white border rounded-xl p-6 shadow-sm">
                                                                    <h3 className="font-semibold text-gray-800 mb-4">Institution Details</h3>
                                                                    <div className="space-y-3 text-sm">
                                                                        <div className="flex justify-between"><span className="text-gray-500">Institute</span><span className="font-medium">{u.instituteName}</span></div>
                                                                        <div className="flex justify-between"><span className="text-gray-500">Type</span><span className="font-medium">{u.instituteType}</span></div>
                                                                        <div className="flex justify-between">
                                                                            <span className="text-gray-500">Status</span>
                                                                            {isUserActive(u.lastLogin)
                                                                                ? <span className="text-green-600 bg-green-100 px-2 py-1 rounded text-xs">Active</span>
                                                                                : <span className="text-gray-500 bg-gray-100 px-2 py-1 rounded text-xs">Inactive</span>
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="mt-6">
                                                                <button onClick={() => handleEditClick(u)} className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg">
                                                                    Edit Doctor
                                                                </button>
                                                            </div>
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

                {/* ── MOBILE CARD LIST (below md) ── */}
                <div className="md:hidden space-y-3">
                    {filteredUsers.map(u => (
                        <div key={u._id} className="bg-white rounded-xl shadow overflow-hidden">

                            {/* Card header row */}
                            <div className="flex items-center justify-between p-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold shrink-0">
                                        {u.username?.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-sm">Dr. {u.username}</p>
                                        <p className="text-xs text-gray-400">{u.instituteType || "Doctor"}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    {isUserActive(u.lastLogin)
                                        ? <span className="text-green-600 bg-green-100 px-2 py-1 rounded-full text-xs">Active</span>
                                        : <span className="text-gray-500 bg-gray-100 px-2 py-1 rounded-full text-xs">Inactive</span>
                                    }
                                    <button
                                        onClick={() => handleViewToggle(u._id)}
                                        className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100"
                                    >
                                        {viewedUserId === u._id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                    </button>
                                </div>
                            </div>

                            {/* Expanded content */}
                            {viewedUserId === u._id && (
                                <div className="border-t px-4 pb-4 pt-3">

                                    {editingUser?._id === u._id ? (
                                        /* EDIT FORM — mobile */
                                        <form onSubmit={handleEditSubmit}>
                                            <h3 className="font-semibold mb-3 text-sm">Edit Doctor</h3>
                                            <div className="grid grid-cols-1 gap-3">
                                                <input name="username" value={editForm.username} onChange={handleEditChange} placeholder="Username" className="border p-2 rounded text-sm w-full" />
                                                <input name="email" value={editForm.email} onChange={handleEditChange} placeholder="Email" className="border p-2 rounded text-sm w-full" />
                                                <input name="phoneNumber" value={editForm.phoneNumber} onChange={handleEditChange} placeholder="Phone" className="border p-2 rounded text-sm w-full" />
                                                <input name="location" value={editForm.location} onChange={handleEditChange} placeholder="Location" className="border p-2 rounded text-sm w-full" />
                                                <input name="instituteName" value={editForm.instituteName} onChange={handleEditChange} placeholder="Institute Name" className="border p-2 rounded text-sm w-full" />
                                                <input name="instituteType" value={editForm.instituteType} onChange={handleEditChange} placeholder="Institute Type" className="border p-2 rounded text-sm w-full" />
                                            </div>
                                            <div className="flex gap-2 mt-3">
                                                <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded text-sm flex-1">Save</button>
                                                <button type="button" onClick={() => setEditingUser(null)} className="bg-gray-200 px-4 py-2 rounded text-sm flex-1">Cancel</button>
                                            </div>
                                        </form>
                                    ) : (
                                        /* DETAILS VIEW — mobile */
                                        <div>
                                            <div className="space-y-2 text-sm mb-4">
                                                <div className="flex justify-between py-1 border-b border-gray-50">
                                                    <span className="text-gray-500">Email</span>
                                                    <span className="font-medium text-right max-w-[60%] truncate">{u.email}</span>
                                                </div>
                                                <div className="flex justify-between py-1 border-b border-gray-50">
                                                    <span className="text-gray-500">Phone</span>
                                                    <span className="font-medium">{u.phoneNumber || "—"}</span>
                                                </div>
                                                <div className="flex justify-between py-1 border-b border-gray-50">
                                                    <span className="text-gray-500">Location</span>
                                                    <span className="font-medium">{u.location || "—"}</span>
                                                </div>
                                                <div className="flex justify-between py-1 border-b border-gray-50">
                                                    <span className="text-gray-500">Institute</span>
                                                    <span className="font-medium">{u.instituteName || "—"}</span>
                                                </div>
                                                <div className="flex justify-between py-1 border-b border-gray-50">
                                                    <span className="text-gray-500">Patients</span>
                                                    <span className="font-semibold text-indigo-600">{u.numberOfPatients || 0}</span>
                                                </div>
                                                <div className="flex justify-between py-1 border-b border-gray-50">
                                                    <span className="text-gray-500">Created</span>
                                                    <span className="font-medium">{formatDate(u.createdAt)}</span>
                                                </div>
                                                <div className="flex justify-between py-1">
                                                    <span className="text-gray-500">Last Active</span>
                                                    <span className="font-medium">{formatDate(u.lastLogin)}</span>
                                                </div>
                                            </div>

                                            {/* Action buttons */}
                                            <div className="flex gap-2 pt-1">
                                                <button
                                                    onClick={() => handleEditClick(u)}
                                                    className="flex items-center gap-1.5 px-3 py-2 bg-yellow-50 text-yellow-700 border border-yellow-200 rounded-lg text-xs font-medium flex-1 justify-center"
                                                >
                                                    <Pencil size={14} /> Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(u)}
                                                    className="flex items-center gap-1.5 px-3 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg text-xs font-medium flex-1 justify-center"
                                                >
                                                    <Trash2 size={14} /> Delete
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

            </div>

            {/* DELETE MODAL */}
            {deleteTarget && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4">
                    <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-sm">
                        <h3 className="font-semibold mb-4">Delete {deleteTarget.username}?</h3>
                        <div className="flex gap-3">
                            <button onClick={() => setDeleteTarget(null)} className="px-4 py-2 bg-gray-200 rounded flex-1">Cancel</button>
                            <button onClick={handleDeleteConfirm} className="px-4 py-2 bg-red-600 text-white rounded flex-1">Delete</button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
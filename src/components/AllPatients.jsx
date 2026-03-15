import React, { useState, useEffect } from "react";
import { patientAPI } from "../api";
import Sidebar from "./Sidebar";
import { Search, ChevronDown, ChevronUp, X, User, Stethoscope, ClipboardList, Calendar, Hash, Download, Loader, Menu } from "lucide-react";
import * as XLSX from 'xlsx';


export default function AllPatients({ setCurrentView }) {

    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState(null);

    const [expandedId, setExpandedId] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Mobile detail sheet
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [exporting, setExporting] = useState(false);

    useEffect(() => {
        fetchAllPatients();
    }, [page]);

    const fetchAllPatients = async () => {
        try {
            setLoading(true);
            const res = await patientAPI.getAllPatients({ page, limit: 10 });
            setPatients(res.data.data);
            setPagination(res.data.pagination);
        } catch (err) {
            setError("Failed to load patients. Admin access required.");
        } finally {
            setLoading(false);
        }
    };

    const handleExport = async () => {
        setActionLoading(true);
        setExporting(true);
        try {
            const res = await patientAPI.getAllPatients({ page: 1, limit: 10000 });
            const allPatients = res.data.data;

            const patientsByDoctor = {};
            allPatients.forEach(patient => {
                const doctorName = patient.createdBy?.username || patient.createdBy?.email || "Unknown Doctor";
                if (!patientsByDoctor[doctorName]) {
                    patientsByDoctor[doctorName] = [];
                }
                patientsByDoctor[doctorName].push(patient);
            });

            const wb = XLSX.utils.book_new();

            Object.keys(patientsByDoctor).forEach(doctorName => {
                const patients = patientsByDoctor[doctorName];

                const sheetData = [
                    ['Patient ID', 'Name', 'Age', 'Diagnosis', 'Remarks', 'Created Date']
                ];

                patients.forEach(patient => {
                    const diagnosis = patient.assessments?.[0]?.diagnosis?.title || '';
                    sheetData.push([
                        patient.patientId || '',
                        patient.name || '',
                        patient.age || '',
                        diagnosis,
                        patient.remarks || '',
                        new Date(patient.createdAt).toLocaleDateString()
                    ]);
                });

                const ws = XLSX.utils.aoa_to_sheet(sheetData);
                ws['!cols'] = [
                    { wch: 15 }, { wch: 20 }, { wch: 8 }, { wch: 25 },
                    { wch: 30 }, { wch: 15 }
                ];
                let sheetName = doctorName.substring(0, 31).replace(/[\\\/\*\[\]\:\?]/g, '-');
                XLSX.utils.book_append_sheet(wb, ws, sheetName);
            });

            const fileName = `patients_by_doctor_${new Date().toISOString().split('T')[0]}.xlsx`;
            XLSX.writeFile(wb, fileName);

        } catch (err) {
            console.error("Export failed:", err);
            alert("Failed to export data. Please try again.");
        } finally {
            setActionLoading(false);
            setExporting(false);
        }
    };

    const filteredPatients = patients.filter((p) => {
        const searchText = search.toLowerCase();
        return (
            p.name?.toLowerCase().includes(searchText) ||
            p.patientId?.toLowerCase().includes(searchText) ||
            p.createdBy?.username?.toLowerCase().includes(searchText) ||
            p.createdBy?.email?.toLowerCase().includes(searchText)
        );
    });

    if (loading) {
        return (
            <div className="flex min-h-screen bg-[#f6f8fc] items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader size={48} className="text-indigo-600 animate-spin" />
                    <p className="text-gray-600 text-lg font-medium">Loading patients...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-[#f6f8fc]">

            {/* Desktop Sidebar */}
            <div className="hidden md:block">
                <Sidebar setCurrentView={setCurrentView} active="allPatients" role="admin" />
            </div>

            <div className="flex-1 min-w-0 flex flex-col">

                {/* Mobile Sidebar Drawer */}
                {sidebarOpen && (
                    <div className="md:hidden fixed inset-0 z-50 flex">
                        <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
                        <div className="relative z-10 h-full">
                            <Sidebar setCurrentView={setCurrentView} active="allPatients" role="admin" onClose={() => setSidebarOpen(false)} />
                        </div>
                    </div>
                )}

                <div className="flex-1 p-4 sm:p-6 lg:p-10 min-w-0">

                    {/* HEADER */}
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 sm:mb-8">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="md:hidden p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition shrink-0"
                            >
                                <Menu size={20} />
                            </button>
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">All Patients</h1>
                                <p className="text-gray-500 mt-0.5 text-sm">
                                    {pagination ? `${pagination.total} total patients` : "Loading..."}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 flex-wrap">
                            <button
                                onClick={handleExport}
                                disabled={actionLoading}
                                className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl shadow-sm hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                            >
                                {actionLoading ? (
                                    <Loader size={16} className="animate-spin" />
                                ) : (
                                    <Download size={16} />
                                )}
                                <span className="text-sm font-medium hidden sm:inline">
                                    {exporting ? "Exporting..." : "Export"}
                                </span>
                            </button>

                            <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-xl shadow-sm border border-gray-100 flex-1 sm:flex-none sm:w-80">
                                <Search size={16} className="text-gray-400 shrink-0" />
                                <input
                                    placeholder="Search by name, ID, doctor..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    disabled={actionLoading}
                                    className="w-full outline-none text-sm bg-transparent disabled:opacity-50"
                                />
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-5 py-4 mb-6 text-sm">
                            {error}
                        </div>
                    )}

                    {/* ── DESKTOP TABLE ── */}
                    <div className="bg-white rounded-xl shadow overflow-hidden hidden md:block relative">
                        {actionLoading && (
                            <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10 rounded-xl">
                                <div className="flex flex-col items-center gap-2">
                                    <Loader size={32} className="text-indigo-600 animate-spin" />
                                    <p className="text-sm text-gray-600 font-medium">{exporting ? "Exporting data..." : "Processing..."}</p>
                                </div>
                            </div>
                        )}
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[700px]">
                                <thead className="bg-gray-50 text-gray-500 text-sm">
                                    <tr>
                                        <th className="px-6 py-4 text-left">Patient ID</th>
                                        <th className="px-6 py-4 text-left">Patient</th>
                                        <th className="px-6 py-4 text-left">Age</th>
                                        <th className="px-6 py-4 text-left">Diagnosis</th>
                                        <th className="px-6 py-4 text-left">Doctor</th>
                                        <th className="px-6 py-4 text-left">Created</th>
                                        <th className="px-6 py-4 text-left">Details</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredPatients.map((patient) => (
                                        <React.Fragment key={patient._id}>
                                            <tr className="border-b hover:bg-gray-50">
                                                <td className="px-6 py-4">
                                                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">{patient.patientId}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold shrink-0">
                                                            {patient.name?.charAt(0)}
                                                        </div>
                                                        <span className="font-semibold text-gray-800">{patient.name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600">{patient.age}</td>
                                                <td className="px-6 py-4 text-sm text-gray-700">
                                                    {patient.assessments?.[0]?.diagnosis?.title || patient.headacheType || "-"}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-700">
                                                    {patient.createdBy?.username || patient.createdBy?.email || "-"}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500">
                                                    {new Date(patient.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <button
                                                        onClick={() => setExpandedId(expandedId === patient._id ? null : patient._id)}
                                                        disabled={actionLoading}
                                                        className="text-indigo-600 hover:text-indigo-800 text-sm font-medium disabled:opacity-50"
                                                    >
                                                        {expandedId === patient._id ? "Hide" : "View"}
                                                    </button>
                                                </td>
                                            </tr>

                                            {expandedId === patient._id && (
                                                <tr className="bg-gray-50">
                                                    <td colSpan={7} className="p-8 relative">
                                                        {actionLoading && (
                                                            <div className="absolute inset-0 bg-gray-50/50 flex items-center justify-center rounded-lg">
                                                                <Loader size={24} className="text-indigo-600 animate-spin" />
                                                            </div>
                                                        )}
                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                            <div className="bg-white border rounded-xl p-6 shadow-sm">
                                                                <h3 className="font-semibold text-gray-800 mb-4">Patient Profile</h3>
                                                                <div className="space-y-3 text-sm">
                                                                    <Info label="Name" value={patient.name} />
                                                                    <Info label="Age" value={patient.age} />
                                                                    <Info label="Headache Type" value={patient.headacheType || "-"} />
                                                                    <Info label="Severity" value={patient.severity || "-"} />
                                                                    <Info label="Remarks" value={patient.remarks || "-"} />
                                                                </div>
                                                            </div>
                                                            <div className="bg-white border rounded-xl p-6 shadow-sm">
                                                                <h3 className="font-semibold text-gray-800 mb-4">Doctor Information</h3>
                                                                <div className="space-y-3 text-sm">
                                                                    <Info label="Created By" value={patient.createdBy?.username || patient.createdBy?.email || "-"} />
                                                                    <Info label="Doctor Email" value={patient.createdBy?.email || "-"} />
                                                                    <Info label="Patient ID" value={patient.patientId} />
                                                                    <Info label="Created On" value={new Date(patient.createdAt).toLocaleDateString()} />
                                                                </div>
                                                            </div>
                                                            <div className="bg-white border rounded-xl p-6 shadow-sm">
                                                                <h3 className="font-semibold text-gray-800 mb-4">Diagnosis History</h3>
                                                                {patient.assessments?.length > 0 ? (
                                                                    <div className="space-y-3 max-h-40 overflow-y-auto">
                                                                        {patient.assessments.map((a, i) => (
                                                                            <div key={i} className="bg-gray-50 border rounded-lg p-3">
                                                                                <p className="font-semibold text-gray-800">{a.diagnosis?.title || `Assessment ${i + 1}`}</p>
                                                                                {a.diagnosis?.severity && <p className="text-xs text-gray-500">Severity: {a.diagnosis.severity}</p>}
                                                                                <p className="text-xs text-gray-400">{new Date(a.createdAt).toLocaleDateString()}</p>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                ) : (
                                                                    <p className="text-gray-400 text-sm">No diagnosis records yet</p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* ── MOBILE LIST ── */}
                    <div className="md:hidden space-y-2 relative">
                        {actionLoading && (
                            <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-20">
                                <div className="bg-white rounded-xl p-6 flex flex-col items-center gap-3 shadow-xl">
                                    <Loader size={36} className="text-indigo-600 animate-spin" />
                                    <p className="text-sm text-gray-600 font-medium">{exporting ? "Exporting data..." : "Processing..."}</p>
                                </div>
                            </div>
                        )}
                        {filteredPatients.map((patient, idx) => {
                            const diagnosis = patient.assessments?.[0]?.diagnosis?.title || patient.headacheType;
                            const doctor = patient.createdBy?.username || patient.createdBy?.email || "-";
                            return (
                                <button
                                    key={patient._id}
                                    onClick={() => setSelectedPatient(patient)}
                                    disabled={actionLoading}
                                    className="w-full bg-white rounded-2xl px-4 py-4 flex items-center gap-4 shadow-sm border border-gray-100 text-left active:scale-[0.99] transition-transform disabled:opacity-50"
                                >
                                    {/* Avatar */}
                                    <div className="w-11 h-11 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-base shrink-0">
                                        {patient.name?.charAt(0)}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-2">
                                            <p className="font-semibold text-gray-900 text-sm truncate">{patient.name}</p>
                                            <span className="text-xs text-gray-400 shrink-0">Age {patient.age ?? "—"}</span>
                                        </div>
                                        <p className="text-xs text-gray-400 mt-0.5 truncate">
                                            {diagnosis
                                                ? <span className="text-indigo-500 font-medium">{diagnosis}</span>
                                                : <span className="italic">No diagnosis</span>
                                            }
                                        </p>
                                        <p className="text-xs text-gray-400 mt-0.5">Dr. {doctor} · {new Date(patient.createdAt).toLocaleDateString()}</p>
                                    </div>

                                    {/* Chevron */}
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="9 18 15 12 9 6" />
                                    </svg>
                                </button>
                            );
                        })}

                        {filteredPatients.length === 0 && (
                            <div className="text-center py-12 text-gray-400 text-sm">No patients found</div>
                        )}
                    </div>

                    {/* PAGINATION */}
                    {pagination?.pages > 1 && (
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-6">
                            <p className="text-sm text-gray-500">Page {page} of {pagination.pages}</p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setPage((p) => p - 1)}
                                    disabled={page === 1 || actionLoading}
                                    className="px-4 py-2 bg-white border rounded-lg text-sm disabled:opacity-40"
                                >
                                    Prev
                                </button>
                                <button
                                    onClick={() => setPage((p) => p + 1)}
                                    disabled={page === pagination.pages || actionLoading}
                                    className="px-4 py-2 bg-white border rounded-lg text-sm disabled:opacity-40"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}

                </div>
            </div>

            {/* ── MOBILE BOTTOM SHEET ── */}
            {selectedPatient && !actionLoading && (
                <div className="md:hidden fixed inset-0 z-50 flex flex-col justify-end">

                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/40"
                        onClick={() => setSelectedPatient(null)}
                    />

                    {/* Sheet */}
                    <div className="relative bg-white rounded-t-3xl max-h-[88vh] overflow-y-auto z-10">

                        {/* Drag handle */}
                        <div className="flex justify-center pt-3 pb-1">
                            <div className="w-10 h-1 bg-gray-200 rounded-full" />
                        </div>

                        {/* Sheet Header */}
                        <div className="flex items-center justify-between px-5 py-4 border-b">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                                    {selectedPatient.name?.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900">{selectedPatient.name}</p>
                                    <p className="text-xs text-gray-400">{selectedPatient.patientId}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedPatient(null)}
                                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {/* Diagnosis Badge */}
                        {(selectedPatient.assessments?.[0]?.diagnosis?.title || selectedPatient.headacheType) && (
                            <div className="px-5 pt-4">
                                <span className="inline-block text-xs bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-full font-semibold">
                                    {selectedPatient.assessments?.[0]?.diagnosis?.title || selectedPatient.headacheType}
                                </span>
                            </div>
                        )}

                        {/* Detail Sections */}
                        <div className="px-5 py-4 space-y-4">

                            {/* Patient Profile */}
                            <Section icon={<User size={15} />} title="Patient Profile">
                                <SheetInfo label="Age" value={selectedPatient.age} />
                                <SheetInfo label="Headache Type" value={selectedPatient.headacheType || "—"} />
                                <SheetInfo label="Severity" value={selectedPatient.severity || "—"} />
                                {selectedPatient.remarks && <SheetInfo label="Remarks" value={selectedPatient.remarks} />}
                            </Section>

                            {/* Doctor Info */}
                            <Section icon={<Stethoscope size={15} />} title="Doctor Information">
                                <SheetInfo label="Doctor" value={selectedPatient.createdBy?.username || selectedPatient.createdBy?.email || "—"} />
                                <SheetInfo label="Email" value={selectedPatient.createdBy?.email || "—"} />
                                <SheetInfo label="Created" value={new Date(selectedPatient.createdAt).toLocaleDateString()} />
                            </Section>

                            {/* Diagnosis History */}
                            <Section icon={<ClipboardList size={15} />} title="Diagnosis History">
                                {selectedPatient.assessments?.length > 0 ? (
                                    <div className="space-y-2 mt-1">
                                        {selectedPatient.assessments.map((a, i) => (
                                            <div key={i} className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                                                <p className="font-semibold text-gray-800 text-sm">{a.diagnosis?.title || `Assessment ${i + 1}`}</p>
                                                {a.diagnosis?.severity && (
                                                    <p className="text-xs text-gray-500 mt-0.5">Severity: {a.diagnosis.severity}</p>
                                                )}
                                                <p className="text-xs text-gray-400 mt-0.5">{new Date(a.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-400 text-sm mt-1">No diagnosis records yet</p>
                                )}
                            </Section>

                        </div>

                        {/* Safe area bottom spacing */}
                        <div className="h-6" />
                    </div>
                </div>
            )}

        </div>
    );
}

// ── Helpers ──

function Info({ label, value }) {
    return (
        <div className="flex justify-between gap-2">
            <span className="text-gray-500 shrink-0">{label}</span>
            <span className="font-medium text-gray-800 text-right break-all">{value}</span>
        </div>
    );
}

function Section({ icon, title, children }) {
    return (
        <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
            <div className="flex items-center gap-2 mb-3">
                <span className="text-indigo-500">{icon}</span>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">{title}</p>
            </div>
            {children}
        </div>
    );
}

function SheetInfo({ label, value }) {
    return (
        <div className="flex justify-between items-start gap-3 py-1.5 border-b border-gray-100 last:border-0">
            <span className="text-xs text-gray-400 shrink-0">{label}</span>
            <span className="text-xs font-semibold text-gray-800 text-right break-all">{value}</span>
        </div>
    );
}
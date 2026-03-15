import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Sidebar from "./Sidebar";
import { Search, Menu, FileDown, Trash2, ChevronDown, ChevronUp, Loader } from "lucide-react";

const Patients = ({ setCurrentView }) => {

    const [patients, setPatients] = useState([]);
    const [filteredPatients, setFilteredPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState("");

    const [expandedPatient, setExpandedPatient] = useState(null);
    const [patientDetails, setPatientDetails] = useState({});
    const [deleteTarget, setDeleteTarget] = useState(null);

    const [searchQuery, setSearchQuery] = useState("");
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

    /* FETCH PATIENTS */

    const fetchPatients = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const res = await axios.get(
                "/api/patients/my-patients",
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setPatients(res.data.data);
            setFilteredPatients(res.data.data);
        } catch {
            setError("Failed to fetch patients");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchPatients(); }, []);

    /* SEARCH */

    useEffect(() => {
        let filtered = patients;
        if (searchQuery) {
            filtered = filtered.filter((patient) =>
                patient.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        setFilteredPatients(filtered);
    }, [searchQuery, patients]);

    /* VIEW DETAILS */

    const handleViewDetails = async (patientId) => {
        if (expandedPatient === patientId) {
            setExpandedPatient(null);
            return;
        }
        try {
            setActionLoading(true);
            const token = localStorage.getItem("token");
            const res = await axios.get(
                `/api/patients/${patientId}/assessments`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setPatientDetails(prev => ({ ...prev, [patientId]: res.data.data }));
            setExpandedPatient(patientId);
        } catch (err) {
            console.error(err);
            setError("Failed to load patient details");
        } finally {
            setActionLoading(false);
        }
    };

    /* PDF DOWNLOAD */

    const handleDownloadPDF = async (patientId) => {
        try {
            setActionLoading(true);
            const token = localStorage.getItem("token");
            const res = await axios.get(
                `/api/patients/${patientId}/assessments`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const assessments = res.data.data || [];
            if (assessments.length === 0) { alert("No assessments found"); setActionLoading(false); return; }

            const patient = patients.find((p) => p._id === patientId);
            const latestAssessment = assessments[assessments.length - 1];
            const diagnosis = latestAssessment.diagnosis || {};
            const doc = new jsPDF();
            const today = new Date().toLocaleDateString();

            doc.setFontSize(18);
            doc.setFont(undefined, "bold");
            doc.text("NEURO HEADACHE ASSESSMENT REPORT", 105, 18, { align: "center" });
            doc.setFontSize(10);
            doc.setFont(undefined, "normal");
            doc.text(`Report Date: ${today}`, 160, 10);
            doc.line(14, 22, 196, 22);

            let y = 35;
            doc.setFontSize(12);
            doc.setFont(undefined, "bold");
            doc.text("Patient Information", 14, y);
            doc.line(14, y + 2, 196, y + 2);
            y += 10;

            if (patient.patientImage) {
                try {
                    const imageUrl = patient.patientImage.startsWith('http')
                        ? patient.patientImage
                        : `http://3.239.186.138:5001${patient.patientImage}`;
                    doc.addImage(imageUrl, "JPEG", 14, y, 30, 30);
                } catch {}
            }

            doc.setFont(undefined, "normal");
            doc.text(`Name: ${patient.name}`, 50, y + 5);
            doc.text(`Age: ${patient.age}`, 50, y + 12);
            doc.text(`Patient ID: ${patient._id}`, 50, y + 19);
            doc.text(`Severity: ${diagnosis.severity || "N/A"}`, 50, y + 26);
            y += 40;

            doc.setFont(undefined, "bold");
            doc.text("Assessment Questionnaire", 14, y);
            doc.line(14, y + 2, 196, y + 2);
            y += 8;

            const tableData = latestAssessment.assessmentFlow.map((item) => [
                item.question,
                Array.isArray(item.answer) ? item.answer.join(", ") : item.answer
            ]);

            autoTable(doc, {
                startY: y,
                head: [["Question", "Answer"]],
                body: tableData,
                headStyles: { fillColor: [41, 128, 185], textColor: 255 },
                styles: { fontSize: 10, cellPadding: 4 },
                columnStyles: { 0: { cellWidth: 130 }, 1: { cellWidth: 50 } }
            });

            y = doc.lastAutoTable.finalY + 15;
            doc.setDrawColor(200);
            doc.rect(14, y, 182, 25);
            doc.setFont(undefined, "bold");
            doc.text("Diagnosis", 16, y + 8);
            doc.setFont(undefined, "normal");
            doc.text(diagnosis.title || "Diagnosis not determined", 16, y + 16);
            y += 35;

            doc.setFont(undefined, "bold");
            doc.text("Clinical Notes", 14, y);
            doc.line(14, y + 2, 196, y + 2);
            doc.setFont(undefined, "normal");
            const notes = diagnosis.message || "Some patients may experience both migraine and cluster headaches.";
            doc.text(notes, 14, y + 12, { maxWidth: 180 });

            doc.setFontSize(10);
            doc.setTextColor(120);
            doc.text("Generated by Neuro Headache Assessment System", 105, 285, { align: "center" });
            doc.save(`${patient.name}_assessment_report.pdf`);
        } catch {
            alert("Failed to generate PDF");
        } finally {
            setActionLoading(false);
        }
    };

    /* DELETE */

    const handleDelete = async (patientId) => {
        try {
            setActionLoading(true);
            const token = localStorage.getItem("token");
            await axios.delete(
                `/api/patients/${patientId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setPatients(prev => prev.filter(p => p._id !== patientId));
            setFilteredPatients(prev => prev.filter(p => p._id !== patientId));
            setDeleteTarget(null);
        } catch {
            alert("Failed to delete patient");
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-screen bg-[#f5f7fb] items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader size={48} className="text-indigo-600 animate-spin" />
                    <p className="text-gray-600 text-lg font-medium">Loading patients...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-[#f5f7fb]">

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
                    active="patients"
                    role="doctor"
                    onClose={() => setMobileSidebarOpen(false)}
                />
            </div>

            <div className="flex-1 min-w-0 px-4 sm:px-6 lg:px-10 py-6 sm:py-8">

                {/* HEADER */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 sm:mb-8">

                    <div className="flex items-center gap-3">
                        {/* Mobile hamburger */}
                        <button
                            className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-200"
                            onClick={() => setMobileSidebarOpen(true)}
                        >
                            <Menu size={22} />
                        </button>
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800">My Patients</h1>
                            <p className="text-gray-500 text-sm sm:text-[15px]">Manage and monitor your patient cases</p>
                        </div>
                    </div>

                    {/* Search */}
                    <div className="bg-white px-4 py-3 rounded-xl shadow flex items-center gap-3 w-full sm:w-80">
                        <Search size={18} className="text-gray-400 shrink-0" />
                        <input
                            placeholder="Search patients..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            disabled={actionLoading}
                            className="w-full outline-none text-[15px] disabled:opacity-50"
                        />
                    </div>

                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-5 py-4 mb-6 text-sm">
                        {error}
                    </div>
                )}

                {/* ── DESKTOP TABLE (md+) ── */}
                <div className="hidden md:block bg-white rounded-xl shadow border overflow-hidden relative">
                    {actionLoading && (
                        <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10 rounded-xl">
                            <div className="flex flex-col items-center gap-2">
                                <Loader size={32} className="text-indigo-600 animate-spin" />
                                <p className="text-sm text-gray-600 font-medium">Processing...</p>
                            </div>
                        </div>
                    )}
                    <div className="overflow-x-auto">
                        <table className="w-full text-[15px]">
                            <thead className="bg-gray-50 text-gray-500">
                                <tr>
                                    <th className="px-6 py-4 text-left">Patient</th>
                                    <th className="px-6 py-4 text-left">Age</th>
                                    <th className="px-6 py-4 text-left">Diagnosis</th>
                                    <th className="px-6 py-4 text-left">Created</th>
                                    <th className="px-6 py-4 text-right pr-10">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredPatients.map((patient) => (
                                    <React.Fragment key={patient._id}>
                                        <tr className="border-t hover:bg-gray-50">
                                            <td className="px-6 py-4 flex items-center gap-3 font-medium text-gray-800">
                                                <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold shrink-0">
                                                    {patient.name.charAt(0)}
                                                </div>
                                                {patient.name}
                                            </td>
                                            <td className="px-6 py-4">{patient.age}</td>
                                            <td className="px-6 py-4 text-gray-600">
                                                {patient.assessments?.[patient.assessments.length - 1]?.diagnosis?.title || "Not Diagnosed"}
                                            </td>
                                            <td className="px-6 py-4 text-gray-600">
                                                {new Date(patient.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 flex justify-end gap-2 pr-8">
                                                <button
                                                    onClick={() => handleViewDetails(patient._id)}
                                                    disabled={actionLoading}
                                                    className="bg-indigo-500 hover:bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-2 disabled:opacity-50"
                                                >
                                                    {expandedPatient === patient._id ? "Hide" : "View"}
                                                </button>
                                                <button
                                                    onClick={() => handleDownloadPDF(patient._id)}
                                                    disabled={actionLoading}
                                                    className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-2 disabled:opacity-50"
                                                >
                                                    {actionLoading ? <Loader size={14} className="animate-spin" /> : null}
                                                    PDF
                                                </button>
                                                <button
                                                    onClick={() => setDeleteTarget(patient._id)}
                                                    disabled={actionLoading}
                                                    className="bg-rose-500 hover:bg-rose-600 text-white px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>

                                        {/* EXPANDED VIEW — desktop */}
                                        {expandedPatient === patient._id && (
                                            <tr className="bg-gray-50">
                                                <td colSpan="5" className="p-6 relative">
                                                    {actionLoading && (
                                                        <div className="absolute inset-0 bg-gray-50/50 flex items-center justify-center rounded-lg">
                                                            <Loader size={24} className="text-indigo-600 animate-spin" />
                                                        </div>
                                                    )}
                                                    <div className="grid grid-cols-4 gap-6">
                                                        <div className="bg-white rounded-xl border p-5">
                                                            <h3 className="font-semibold mb-4">Patient Profile</h3>
                                                            <p>Name: {patient.name}</p>
                                                            <p>Age: {patient.age}</p>
                                                        </div>
                                                        <div className="bg-white rounded-xl border p-5">
                                                            <h3 className="font-semibold mb-4">Doctor Information</h3>
                                                            <p>Created On: {new Date(patient.createdAt).toLocaleDateString()}</p>
                                                            <p>Patient ID: {patient.patientId}</p>
                                                        </div>
                                                        <div className="bg-white rounded-xl border p-5">
                                                            <h3 className="font-semibold mb-4">Diagnosis History</h3>
                                                            {patientDetails[patient._id]?.map((a, i) => (
                                                                <div key={i} className="border rounded-lg p-3 mb-3 bg-gray-50">
                                                                    <p className="font-medium text-sm">{a.diagnosis?.title}</p>
                                                                    <p className="text-xs text-gray-500 mb-2">{new Date(a.createdAt).toLocaleDateString()}</p>

                                                                    <div className="border-t pt-2 mt-2 space-y-1">
                                                                        <p className="text-xs">
                                                                            <span className="font-semibold">Match Prescription:</span>{" "}
                                                                            <span className={a.diagnosisMatch ? "text-green-600" : "text-red-600"}>
                                                                                {a.diagnosisMatch ? "Yes" : "No"}
                                                                            </span>
                                                                        </p>

                                                                        {!a.diagnosisMatch && a.diagnosisIssue && (
                                                                            <p className="text-xs">
                                                                                <span className="font-semibold">Issue:</span> {a.diagnosisIssue}
                                                                            </p>
                                                                        )}

                                                                        {a.remarks && (
                                                                            <p className="text-xs">
                                                                                <span className="font-semibold">Remarks:</span> {a.remarks}
                                                                            </p>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                        <div className="bg-white rounded-xl border p-5">
                                                            <h3 className="font-semibold mb-4">Patient Image</h3>
                                                            {patient.patientImage ? (
                                                                <img
                                                                    src={patient.patientImage.startsWith('http') ? patient.patientImage : `http://3.239.186.138:5001${patient.patientImage}`}
                                                                    alt={patient.name}
                                                                    className="w-full h-40 object-cover rounded-lg"
                                                                />
                                                            ) : (
                                                                <div className="w-full h-40 bg-gray-100 rounded-lg flex items-center justify-center">
                                                                    <p className="text-gray-400">No image</p>
                                                                </div>
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

                {/* ── MOBILE CARD LIST (below md) ── */}
                <div className="md:hidden space-y-3 relative">
                    {actionLoading && (
                        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-20">
                            <div className="bg-white rounded-xl p-6 flex flex-col items-center gap-3 shadow-xl">
                                <Loader size={36} className="text-indigo-600 animate-spin" />
                                <p className="text-sm text-gray-600 font-medium">Processing...</p>
                            </div>
                        </div>
                    )}
                    {filteredPatients.map((patient) => (
                        <div key={patient._id} className="bg-white rounded-xl shadow border overflow-hidden">

                            {/* Card header */}
                            <div className="flex items-center justify-between p-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold shrink-0">
                                        {patient.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-sm text-gray-800">{patient.name}</p>
                                        <p className="text-xs text-gray-400">
                                            Age {patient.age} · {new Date(patient.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleViewDetails(patient._id)}
                                    disabled={actionLoading}
                                    className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 disabled:opacity-50"
                                >
                                    {expandedPatient === patient._id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                </button>
                            </div>

                            {/* Diagnosis badge */}
                            <div className="px-4 pb-3 flex items-center justify-between">
                                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                    {patient.assessments?.[patient.assessments.length - 1]?.diagnosis?.title || "Not Diagnosed"}
                                </span>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleDownloadPDF(patient._id)}
                                        disabled={actionLoading}
                                        className="flex items-center gap-1 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-xs font-medium transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50"
                                    >
                                        {actionLoading ? <Loader size={13} className="animate-spin" /> : <FileDown size={13} />}
                                        PDF
                                    </button>
                                    <button
                                        onClick={() => setDeleteTarget(patient._id)}
                                        disabled={actionLoading}
                                        className="flex items-center gap-1 bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-lg text-xs font-medium transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50"
                                    >
                                        <Trash2 size={13} /> Delete
                                    </button>
                                </div>
                            </div>

                            {/* EXPANDED VIEW — mobile */}
                            {expandedPatient === patient._id && (
                                <div className="border-t px-4 py-4 space-y-3">

                                    {/* Profile + Info */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="bg-gray-50 rounded-xl border p-4">
                                            <h3 className="font-semibold text-sm mb-2">Patient Profile</h3>
                                            <p className="text-xs text-gray-600">Name: {patient.name}</p>
                                            <p className="text-xs text-gray-600">Age: {patient.age}</p>
                                        </div>
                                        <div className="bg-gray-50 rounded-xl border p-4">
                                            <h3 className="font-semibold text-sm mb-2">Info</h3>
                                            <p className="text-xs text-gray-600">Created: {new Date(patient.createdAt).toLocaleDateString()}</p>
                                            <p className="text-xs text-gray-600">ID: {patient.patientId}</p>
                                        </div>
                                    </div>

                                    {/* Diagnosis History */}
                                    <div className="bg-gray-50 rounded-xl border p-4">
                                        <h3 className="font-semibold text-sm mb-2">Diagnosis History</h3>
                                        {patientDetails[patient._id]?.length > 0 ? (
                                            patientDetails[patient._id].map((a, i) => (
                                                <div key={i} className="border rounded-lg p-3 mb-2 bg-white">
                                                    <p className="font-medium text-xs">{a.diagnosis?.title}</p>
                                                    <p className="text-xs text-gray-400 mb-2">{new Date(a.createdAt).toLocaleDateString()}</p>

                                                    <div className="border-t pt-2 space-y-1">
                                                        <p className="text-xs">
                                                            <span className="font-semibold">Match:</span>{" "}
                                                            <span className={a.diagnosisMatch ? "text-green-600" : "text-red-600"}>
                                                                {a.diagnosisMatch ? "Yes" : "No"}
                                                            </span>
                                                        </p>

                                                        {!a.diagnosisMatch && a.diagnosisIssue && (
                                                            <p className="text-xs">
                                                                <span className="font-semibold">Issue:</span> {a.diagnosisIssue}
                                                            </p>
                                                        )}

                                                        {a.remarks && (
                                                            <p className="text-xs">
                                                                <span className="font-semibold">Remarks:</span> {a.remarks}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-xs text-gray-400">No history available</p>
                                        )}
                                    </div>

                                    {/* Patient Image */}
                                    <div className="bg-gray-50 rounded-xl border p-4">
                                        <h3 className="font-semibold text-sm mb-2">Patient Image</h3>
                                        {patient.patientImage ? (
                                            <img
                                                src={patient.patientImage.startsWith('http') ? patient.patientImage : `http://3.239.186.138:5001${patient.patientImage}`}
                                                alt={patient.name}
                                                className="w-full h-36 object-cover rounded-lg"
                                            />
                                        ) : (
                                            <div className="w-full h-36 bg-gray-100 rounded-lg flex items-center justify-center">
                                                <p className="text-gray-400 text-xs">No image</p>
                                            </div>
                                        )}
                                    </div>

                                </div>
                            )}
                        </div>
                    ))}
                </div>

            </div>

            {/* DELETE MODAL */}
            {deleteTarget && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
                    <div className="bg-white rounded-xl p-6 w-full max-w-sm">
                        <h3 className="font-semibold text-lg mb-3">Delete Patient</h3>
                        <p className="text-gray-600 mb-6">Are you sure you want to delete this patient?</p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setDeleteTarget(null)}
                                disabled={actionLoading}
                                className="px-4 py-2 border rounded-lg disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDelete(deleteTarget)}
                                disabled={actionLoading}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg flex items-center gap-2 disabled:opacity-50"
                            >
                                {actionLoading ? <Loader size={14} className="animate-spin" /> : null}
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Patients;
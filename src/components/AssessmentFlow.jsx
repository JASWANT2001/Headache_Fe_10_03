import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const AssessmentFlow = () => {
  const { patientId } = useParams(); // Get patient ID from URL
  const navigate = useNavigate();
  
  const [patient, setPatient] = useState(null);
  const [assessments, setAssessments] = useState([]);
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch patient and assessments
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        // Fetch patient details
        const patientRes = await axios.get(
          `http://3.239.186.138:5001/api/patients/${patientId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setPatient(patientRes.data.data);

        // Fetch assessments
        const assessmentRes = await axios.get(
          `http://3.239.186.138:5001/api/patients/${patientId}/assessments`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        
        const assessmentsData = assessmentRes.data.data;
        setAssessments(assessmentsData);
        
        // Auto-select most recent assessment
        if (assessmentsData.length > 0) {
          setSelectedAssessment(assessmentsData[0]);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to fetch assessment data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [patientId]);

  const severityConfig = {
    High: {
      bg: "bg-rose-50",
      text: "text-rose-700",
      border: "border-rose-200",
      icon: "🔴",
      badge: "bg-rose-100 text-rose-700 border-rose-300",
    },
    Medium: {
      bg: "bg-amber-50",
      text: "text-amber-700",
      border: "border-amber-200",
      icon: "🟡",
      badge: "bg-amber-100 text-amber-700 border-amber-300",
    },
    Low: {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      border: "border-emerald-200",
      icon: "🟢",
      badge: "bg-emerald-100 text-emerald-700 border-emerald-300",
    },
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-slate-200 rounded w-1/3"></div>
            <div className="h-64 bg-slate-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-rose-50 border border-rose-200 text-rose-700 p-6 rounded-2xl">
            <span className="text-2xl mr-3">⚠️</span>
            <span className="font-medium">{error}</span>
          </div>
        </div>
      </div>
    );
  }

  const diagnosisConfig = selectedAssessment
    ? severityConfig[selectedAssessment.diagnosis?.severity] || severityConfig.Low
    : severityConfig.Low;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 p-8">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Inter:wght@400;500;600&display=swap');

        .header-title {
          font-family: 'Playfair Display', serif;
          letter-spacing: -0.02em;
        }

        .flow-step {
          animation: slideIn 0.5s ease-out forwards;
          opacity: 0;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .timeline-line {
          background: linear-gradient(to bottom, #3b82f6, #8b5cf6);
          width: 3px;
          position: absolute;
          left: 23px;
          top: 40px;
          bottom: 0;
        }
      `}</style>

      <div className="max-w-6xl mx-auto">
        {/* Header with Back Button */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/patients")}
            className="mb-4 flex items-center gap-2 text-slate-600 hover:text-slate-800 transition font-medium"
          >
            <span className="text-xl">←</span>
            <span>Back to Patients</span>
          </button>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="header-title text-5xl font-bold text-slate-800 mb-2">
                Assessment History
              </h1>
              {patient && (
                <p className="text-slate-500 text-lg">
                  Patient: <span className="font-semibold text-slate-700">{patient.name}</span> 
                  <span className="mx-2">•</span>
                  Age: {patient.age}
                  <span className="mx-2">•</span>
                  Type: {patient.headacheType}
                </p>
              )}
            </div>

            {patient && (
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                {patient.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        </div>

        {/* No Assessments */}
        {assessments.length === 0 && (
          <div className="bg-white shadow-sm rounded-2xl p-16 text-center border border-slate-200">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-slate-700 mb-2">
              No Assessments Yet
            </h3>
            <p className="text-slate-500">
              This patient hasn't completed any assessments yet.
            </p>
          </div>
        )}

        {/* Assessment List & Details */}
        {assessments.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Assessment List */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
                <h3 className="text-lg font-bold text-slate-800 mb-4 px-2">
                  All Assessments ({assessments.length})
                </h3>
                <div className="space-y-2">
                  {assessments.map((assessment, index) => {
                    const config = severityConfig[assessment.diagnosis?.severity] || severityConfig.Low;
                    const isSelected = selectedAssessment?._id === assessment._id;
                    
                    return (
                      <button
                        key={assessment._id}
                        onClick={() => setSelectedAssessment(assessment)}
                        className={`w-full text-left p-4 rounded-xl transition-all ${
                          isSelected
                            ? "bg-blue-50 border-2 border-blue-400 shadow-sm"
                            : "bg-slate-50 border border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium text-slate-500">
                            Assessment #{assessments.length - index}
                          </span>
                          <span className="text-lg">{config.icon}</span>
                        </div>
                        <p className="text-sm font-medium text-slate-700 mb-1">
                          {assessment.diagnosis?.title || "No diagnosis"}
                        </p>
                        <p className="text-xs text-slate-500">
                          {formatDate(assessment.submittedAt)}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right: Assessment Flow & Diagnosis */}
            <div className="lg:col-span-2 space-y-6">
              {selectedAssessment && (
                <>
                  {/* Diagnosis Card */}
                  <div className={`${diagnosisConfig.bg} border-2 ${diagnosisConfig.border} rounded-2xl p-8 shadow-sm`}>
                    <div className="flex items-start gap-4 mb-4">
                      <div className="text-5xl">{diagnosisConfig.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h2 className={`text-2xl font-bold ${diagnosisConfig.text}`}>
                            {selectedAssessment.diagnosis?.title || "No Title"}
                          </h2>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${diagnosisConfig.badge}`}>
                            {selectedAssessment.diagnosis?.severity || "Unknown"}
                          </span>
                        </div>
                        <p className={`text-lg ${diagnosisConfig.text} opacity-90`}>
                          {selectedAssessment.diagnosis?.message || "No message provided"}
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-slate-200 grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-slate-500 mb-1">Completed</p>
                        <p className="font-semibold text-slate-700">
                          {formatDate(selectedAssessment.submittedAt)}
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-500 mb-1">Questions Answered</p>
                        <p className="font-semibold text-slate-700">
                          {selectedAssessment.assessmentFlow?.length || 0}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Assessment Flow Timeline */}
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                    <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                      <span>🔍</span>
                      Assessment Flow
                    </h3>

                    {(!selectedAssessment.assessmentFlow || selectedAssessment.assessmentFlow.length === 0) ? (
                      <div className="text-center py-8 text-slate-500">
                        <p>No assessment flow data available</p>
                      </div>
                    ) : (
                      <div className="relative">
                        {/* Timeline Line */}
                        <div className="timeline-line"></div>

                        {/* Flow Steps */}
                        <div className="space-y-6">
                          {selectedAssessment.assessmentFlow.map((step, index) => (
                            <div
                              key={index}
                              className="flow-step relative pl-16"
                              style={{ animationDelay: `${index * 0.1}s` }}
                            >
                              {/* Step Number */}
                              <div className="absolute left-0 top-0 w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-md z-10">
                                {index + 1}
                              </div>

                              {/* Step Content */}
                              <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                                <div className="mb-3">
                                  <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
                                    Question
                                  </span>
                                  <p className="text-base font-medium text-slate-800 mt-1">
                                    {step.question}
                                  </p>
                                </div>

                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wide">
                                    Answer:
                                  </span>
                             {Array.isArray(step.answer) ? (
  <div className="flex flex-wrap gap-2">
    {step.answer.map((ans, i) => (
      <span
        key={i}
        className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium border border-emerald-200"
      >
        {ans}
      </span>
    ))}
  </div>
) : (
  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium border border-emerald-200">
    {step.answer}
  </span>
)}
                                </div>

                                {step.node && (
                                  <div className="mt-2 text-xs text-slate-400">
                                    Node: {step.node}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssessmentFlow;
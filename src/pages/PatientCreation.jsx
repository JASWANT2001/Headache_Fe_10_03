import { useState } from "react";
import Sidebar from "../components/Sidebar";
import { Menu } from "lucide-react";

export default function PatientCreation({ onBack, onStartDiagnosis, setCurrentView }) {

  const [form, setForm] = useState({
    name: "",
    patientId: "",
    age: "",
    specialty: "",
    type: "",
    language: "",
    qualification: "",
    notes: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Patient name is required.";
    if (!form.age || isNaN(form.age) || form.age < 0 || form.age > 130)
      e.age = "Valid age required.";
    if (!form.specialty.trim()) e.specialty = "Specialty is required.";
    if (!form.type) e.type = "Please select type.";
    if (!form.language.trim()) e.language = "Language is required.";
    if (!form.qualification.trim()) e.qualification = "Qualification is required.";
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    setApiError("");
    if (errors[name]) {
      setErrors((p) => ({ ...p, [name]: null }));
    }
  };

  const handleSubmit = async () => {
    const v = validate();
    if (Object.keys(v).length > 0) {
      setErrors(v);
      return;
    }
    try {
      const res = await fetch("//3.239.186.138:5001/api/patients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          name: form.name,
          patientId: form.patientId.trim() || undefined,
          age: form.age,
          specialty: form.specialty,
          type: form.type,
          language: form.language,
          qualification: form.qualification,
          remarks: form.notes,
        }),
      });
      const data = await res.json();
      if (data.success) {
        onStartDiagnosis(data.data);
      } else {
        setApiError(data.message || "Something went wrong");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleReset = () => {
    setForm({
      name: "",
      patientId: "",
      age: "",
      specialty: "",
      type: "",
      language: "",
      qualification: "",
      notes: "",
    });
    setErrors({});
  };

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
          active="createPatient"
          role="doctor"
          onClose={() => setMobileSidebarOpen(false)}
        />
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 min-w-0 px-4 sm:px-6 lg:px-10 py-6 lg:py-10">

        {/* PAGE HEADER */}
        <div className="mb-6 sm:mb-8 flex items-center gap-3">
          {/* Mobile hamburger */}
          <button
            className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-200 shrink-0"
            onClick={() => setMobileSidebarOpen(true)}
          >
            <Menu size={22} />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              New Patient Record
            </h1>
            <p className="text-gray-500 mt-1 text-sm sm:text-base">
              Create a patient profile to begin diagnosis
            </p>
          </div>
        </div>

        {/* FORM CONTAINER */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 w-full">

          {/* CARD HEADER */}
          <div className="border-b border-gray-200 px-5 sm:px-8 py-5">
            <h2 className="text-lg font-semibold text-gray-800">Patient Information</h2>
            <p className="text-sm text-gray-500">Basic patient details required for diagnosis</p>
          </div>

          {/* FORM */}
          <div className="p-5 sm:p-8">
            <form className="space-y-6 sm:space-y-8">

              {/* PATIENT INFO GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">

                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    Patient Name
                  </label>
                  <input
                    name="name"
                    placeholder="Full name"
                    value={form.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none
                    ${errors.name ? "border-red-500" : "border-gray-300"}`}
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    Patient ID (optional)
                  </label>
                  <input
                    name="patientId"
                    placeholder="PT-00123"
                    value={form.patientId}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">Age</label>
                  <input
                    type="number"
                    name="age"
                    placeholder="Years"
                    value={form.age}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none
                    ${errors.age ? "border-red-500" : "border-gray-300"}`}
                  />
                  {errors.age && <p className="text-red-500 text-xs mt-1">{errors.age}</p>}
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">Specialty</label>
                  <input
                    name="specialty"
                    placeholder="Neurology"
                    value={form.specialty}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none
                    ${errors.specialty ? "border-red-500" : "border-gray-300"}`}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">Type</label>
                  <select
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none
                    ${errors.type ? "border-red-500" : "border-gray-300"}`}
                  >
                    <option value="">Select type</option>
                    <option value="Self">Self</option>
                    <option value="Assisted">Assisted</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">Language</label>
                  <input
                    name="language"
                    placeholder="Preferred language"
                    value={form.language}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none
                    ${errors.language ? "border-red-500" : "border-gray-300"}`}
                  />
                </div>

              </div>

              {/* QUALIFICATION */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">Qualification</label>
                <input
                  name="qualification"
                  placeholder="Educational qualification"
                  value={form.qualification}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none
                  ${errors.qualification ? "border-red-500" : "border-gray-300"}`}
                />
              </div>

              {/* NOTES */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Clinical Notes (optional)
                </label>
                <textarea
                  name="notes"
                  rows="4"
                  placeholder="Observations, triggers..."
                  value={form.notes}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              {apiError && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                  {apiError}
                </div>
              )}

              {/* ACTION BUTTONS */}
              <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleReset}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="w-full sm:w-auto px-7 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium shadow-sm"
                >
                  Create Patient →
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
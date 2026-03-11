import React from "react";
import { X } from "lucide-react";

const Sidebar = ({ setCurrentView, active, onClose }) => {

    const role = localStorage.getItem("role");
    const isAdmin = role === "admin";

    const Item = ({ id, label, icon }) => (
        <button
            onClick={() => {
                setCurrentView(id);
                if (onClose) onClose();
            }}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg text-left transition
        ${active === id
                    ? "bg-blue-100 text-blue-700 font-semibold"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
        >
            <span className="text-lg">{icon}</span>
            <span>{label}</span>
        </button>
    );

    const Section = ({ title, children }) => (
        <div className="mt-6">
            <p className="text-xs uppercase text-gray-400 font-semibold px-4 mb-2 tracking-wide">
                {title}
            </p>
            <div className="space-y-1">{children}</div>
        </div>
    );

    return (
        <div className="w-64 bg-white border-r border-gray-200 min-h-screen p-5 flex flex-col">

            {/* APP TITLE + Close button (close only shown on mobile) */}
            <div className="mb-8 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-800">
                    Neuro Admin
                </h1>

                {onClose && (
                    <button
                        onClick={onClose}
                        className="lg:hidden p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition"
                        aria-label="Close sidebar"
                    >
                        <X size={20} />
                    </button>
                )}
            </div>

            {/* OVERVIEW */}
            <Section title="Overview">
                <Item
                    id="dashboard"
                    label="Dashboard"
                    icon="📊"
                />
            </Section>

            {/* ADMIN ONLY */}
            {isAdmin && (
                <Section title="Management">
                    <Item
                        id="doctors"
                        label="Doctors"
                        icon="🩺"
                    />
                    <Item
                        id="allPatients"
                        label="All Patients"
                        icon="👥"
                    />
                </Section>
            )}

            {/* WORKSPACE */}
            <Section title="My Workspace">
                <Item
                    id="patients"
                    label="My Patients"
                    icon="❤️"
                />
                <Item
                    id="createPatient"
                    label="Add Patient"
                    icon="➕"
                />
            </Section>

        </div>
    );
};

export default Sidebar;
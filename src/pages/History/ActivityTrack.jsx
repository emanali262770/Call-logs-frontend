import React from "react";
import { useNavigate } from "react-router-dom";
import { FaUsers, FaHandshake, FaClipboardList, FaUserTie, FaCheckCircle } from "react-icons/fa";

const tracks = [
  {
    label: "Customers Track",
    icon: <FaUsers className="text-indigo-600 text-3xl" />,
    path: "/admin/history/customers",
    desc: "Monitor customer creation, updates, and assignments",
  },
  {
    label: "Meeting Track",
    icon: <FaHandshake className="text-blue-600 text-3xl" />,
    path: "/admin/history/meetings",
    desc: "Track meeting schedules and progress",
  },
  {
    label: "Follow Up Track",
    icon: <FaClipboardList className="text-amber-600 text-3xl" />,
    path: "/admin/history/followups",
    desc: "See recent follow-ups and statuses",
  },
  {
    label: "Success Client Track",
    icon: <FaCheckCircle className="text-green-600 text-3xl" />,
    path: "/admin/history/success",
    desc: "View successfully closed client deals",
  },
  {
    label: "Staff Track",
    icon: <FaUserTie className="text-rose-600 text-3xl" />,
    path: "/admin/history/staff",
    desc: "Monitor staff activity and engagement",
  },
];

const ActivityTrack = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Activity Tracker</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {tracks.map((track) => (
          <div
            key={track.label}
            onClick={() => navigate(track.path)}
            className="bg-white rounded-xl shadow hover:shadow-lg cursor-pointer transition-all border border-gray-100 p-6 flex flex-col items-center text-center hover:-translate-y-1"
          >
            <div className="mb-3">{track.icon}</div>
            <h2 className="text-lg font-semibold text-gray-800">{track.label}</h2>
            <p className="text-sm text-gray-500 mt-1">{track.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityTrack;

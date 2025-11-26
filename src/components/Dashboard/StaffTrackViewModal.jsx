import React from "react";
import { X } from "lucide-react";

const StaffTrackViewModal = ({ data, onClose }) => {
  return (
    <div className="fixed inset-0 max-h-full overflow-y-auto flex items-center justify-center bg-black bg-opacity-50 z-50">
       <div className="bg-white w-[600px] max-h-[90vh] overflow-y-auto rounded-xl shadow-lg p-6 relative">

        {/* Close Button */}
        <button
          className="absolute top-3 right-3 text-gray-600 hover:text-red-500"
          onClick={onClose}
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-bold mb-6 text-center border-b pb-2">
          Staff Login Details
        </h2>

        <div className="space-y-3 text-base">
          <div><strong>Staff Name:</strong> {data.staff || "N/A"}</div>
          <div><strong>Status:</strong> {data.action || "N/A"}</div>
          <div>
            <strong>Last Login:</strong>{" "}
            {data.lastLoginAt ? new Date(data.lastLoginAt).toLocaleString() : "N/A"}
          </div>
          <div>
            <strong>Last Logout:</strong>{" "}
            {data.lastLogoutAt ? new Date(data.lastLogoutAt).toLocaleString() : "N/A"}
          </div>
          <div><strong>Total Logins:</strong> {data.loginHistory?.length || 0}</div>
        </div>

        {/* Login History Table */}
        <h3 className="text-lg font-semibold mt-6 mb-3">Login History:</h3>

        <table className="w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-2 py-1">Sr #</th>
              <th className="border px-2 py-1">Login At</th>
              <th className="border px-2 py-1">Logout At</th>
            </tr>
          </thead>
          <tbody>
            {data.loginHistory?.length > 0 ? (
              data.loginHistory.map((l, idx) => (
                <tr key={idx}>
                  <td className="border px-2 py-1 text-center">{idx + 1}</td>
                  <td className="border px-2 py-1">
                    {l.loginAt ? new Date(l.loginAt).toLocaleString() : "—"}
                  </td>
                  <td className="border px-2 py-1">
                    {l.logoutAt ? new Date(l.logoutAt).toLocaleString() : "—"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="border px-2 py-2 text-center text-gray-500">
                  No history found
                </td>
              </tr>
            )}
          </tbody>
        </table>

      </div>
    </div>
  );
};

export default StaffTrackViewModal;

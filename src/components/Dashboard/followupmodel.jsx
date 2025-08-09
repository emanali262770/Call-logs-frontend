import React, { useState } from "react";

/* ---------- Add Meeting Modal ---------- */
function AddMeetingModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-5xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b px-6 py-4">
          <h2 className="text-xl font-semibold text-gray-800">Add Meeting</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
          >
            &times;
          </button>
        </div>

        {/* Scrollable Form */}
        <div className="overflow-y-auto px-6 py-4 flex-1">
          <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Company Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company Name
              </label>
              <select className="w-full border rounded-md p-2">
                <option value="">Select company</option>
              </select>
            </div>

            {/* Person Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Person Name
              </label>
              <select className="w-full border rounded-md p-2">
                <option value="">Select person</option>
              </select>
            </div>

            {/* Designation */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Designation
              </label>
              <input
                type="text"
                className="w-full border rounded-md p-2 bg-gray-100"
                readOnly
              />
            </div>

            {/* Products */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Products
              </label>
              <select className="w-full border rounded-md p-2">
                <option value="">Select product</option>
              </select>
            </div>

            {/* Status Radio Buttons */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <div className="flex flex-wrap gap-4">
                {[
                  "Follow Up Required",
                  "Not Interested",
                  "Already Installed",
                  "Phone Number Responding"
                ].map((status) => (
                  <label key={status} className="flex items-center gap-2">
                    <input type="radio" name="status" value={status} />
                    {status}
                  </label>
                ))}
              </div>
            </div>

            {/* Follow-up Note */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Follow-up Note
              </label>
              <textarea rows={3} className="w-full border rounded-md p-2"></textarea>
            </div>

            {/* Next Follow-up Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Next Follow-up Date
              </label>
              <input type="date" className="w-full border rounded-md p-2" />
            </div>

            {/* Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Time
              </label>
              <input type="time" className="w-full border rounded-md p-2" />
            </div>

            {/* Next Visit Details */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Next Visit Details
              </label>
              <textarea rows={3} className="w-full border rounded-md p-2"></textarea>
            </div>

            {/* Details Radio Buttons */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Details
              </label>
              <div className="flex flex-wrap gap-4">
                {[
                  "See Profile",
                  "Send Quotation",
                  "Product Information",
                  "Require Visit/Meeting"
                ].map((detail) => (
                  <label key={detail} className="flex items-center gap-2">
                    <input type="radio" name="details" value={detail} />
                    {detail}
                  </label>
                ))}
              </div>
            </div>

            {/* Reference Provided By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reference Provided By
              </label>
              <select className="w-full border rounded-md p-2">
                <option value="">Select reference</option>
              </select>
            </div>

            {/* Refer to Staff */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Refer to Staff
              </label>
              <select className="w-full border rounded-md p-2">
                <option value="">Select staff</option>
              </select>
            </div>

            {/* Communication Method */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Communication Method
              </label>
              <div className="flex flex-wrap gap-4">
                {["By Visit", "By Phone", "By Email"].map((method) => (
                  <label key={method} className="flex items-center gap-2">
                    <input type="radio" name="communication" value={method} />
                    {method}
                  </label>
                ))}
              </div>
            </div>
          </form>
        </div>

        {/* Footer - Save Button */}
        <div className="border-t px-6 py-4 flex justify-center">
          <button
            type="submit"
            className="bg-blue-600 text-white px-8 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Main Page ---------- */
export default function MeetingFollowPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Follow Up</h1>

      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
      >
        Add Meeting
      </button>

      <AddMeetingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

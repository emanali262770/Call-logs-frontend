import React, { useRef, useState } from "react";
import { X, MessageCircle, Mail } from "lucide-react";

const FollowUpViewModal = ({ data, onClose }) => {
  const printRef = useRef();
  const [exportOpen, setExportOpen] = useState(false);

  // ✅ Handle Print
  const handlePrint = () => {
    const printContent = printRef.current.innerHTML;
    const win = window.open("", "", "width=800,height=600");
    win.document.write(`
      <html>
        <head>
          <title>Customer Follow-Up Details</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h2 { text-align: center; margin-bottom: 20px; }
            .info-row { display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 14px; }
            .info-row strong { min-width: 120px; display: inline-block; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background: #f3f3f3; }
          </style>
        </head>
        <body>${printContent}</body>
      </html>
    `);
    win.document.close();
    win.print();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white w-[700px] rounded-xl shadow-lg p-6 relative">
        {/* ❌ Close Button */}
        <button
          className="absolute top-3 right-3 text-gray-600 hover:text-red-500"
          onClick={onClose}
        >
          <X size={20} />
        </button>

        {/* Printable Section */}
        <div ref={printRef}>
          <h2 className="text-2xl font-bold mb-6 text-center border-b pb-2">
            Follow-Up Details
          </h2>

          {/* Info Section */}
          <div className="grid grid-cols-2 gap-y-3 gap-8 text-base mb-6">
            <div>
              <strong>Company Name:</strong> {data.companyName || "N/A"}
            </div>
            <div>
              <strong>Designation:</strong> {data.designation || "N/A"}
            </div>
            <div>
              <strong>Product Name:</strong> {data.product?.name || "N/A"}
            </div>
            <div>
              <strong>Product Price:</strong> {data.product?.price || "N/A"}
            </div>
            <div>
              <strong>Status:</strong> {data.status || "N/A"}
            </div>
            <div>
              <strong>Action:</strong> {data.action || "N/A"}
            </div>
            <div>
              <strong>Reference:</strong> {data.reference || "N/A"}
            </div>
            <div>
              <strong>Contact Method:</strong> {data.contactMethod || "N/A"}
            </div>
            <div>
              <strong>Timeline:</strong> {data.Timeline || "N/A"}
            </div>
           
          </div>

          {/* Person Info */}
          <h3 className="text-lg font-semibold mb-3">Person(s) Info:</h3>
          <table className="w-full border text-sm mb-6">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-2 py-1">Sr #</th>
                <th className="border px-2 py-1">Full Name</th>
                <th className="border px-2 py-1">Phone Number</th>
              </tr>
            </thead>
            <tbody>
              {data.person?.persons?.length > 0 ? (
                data.person.persons.map((p, idx) => (
                  <tr key={idx}>
                    <td className="border text-center px-2 py-1 ">{idx + 1}</td>
                    <td className="border text-center px-2 py-1">{p.fullName}</td>
                    <td className="border text-center px-2 py-1">{p.phoneNumber}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={3}
                    className="border px-2 py-2 text-center text-gray-500"
                  >
                    No person data found
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Follow-Up History Table */}
          <h3 className="text-lg font-semibold mb-3">Follow-Up History:</h3>
          <table className="w-full border text-sm mb-4">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-2 py-1">Sr #</th>
                <th className="border px-2 py-1">Follow-Up Date</th>
                <th className="border px-2 py-1">Follow-Up Time</th>
                <th className="border px-2 py-1">Detail / Remarks</th>
              </tr>
            </thead>
            <tbody>
              {data.followDates?.map((date, idx) => (
                <tr key={idx}>
                  <td className="border px-2 py-1 text-center">{idx + 1}</td>
                  <td className="border px-2 py-1">
                    {new Date(date).toLocaleDateString()}
                  </td>
                  <td className="border px-2 py-1">
                    {data.followTimes?.[idx] || "N/A"}
                  </td>
                  <td className="border px-2 py-1">
                    {data.details?.[idx] || "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Refer to Staff Info (optional) */}
          {data.referToStaff && (
            <>
              <h3 className="text-lg font-semibold mb-3">Referred To Staff:</h3>
              <div className="grid grid-cols-2 gap-y-2 mb-4">
                <div>
                  <strong>Name:</strong> {data.referToStaff.username}
                </div>
                <div>
                  <strong>Email:</strong> {data.referToStaff.email}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Bottom Actions */}
        <div className="flex justify-end gap-3 mt-6">
          <div className="relative">
            <button
              onClick={() => setExportOpen(!exportOpen)}
              className="px-4 py-2 bg-green-600 text-white rounded-md"
            >
              Export
            </button>

            {exportOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg border rounded-md z-50">
                <button
                  onClick={() => alert("Export via WhatsApp")}
                  className="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-100 text-left"
                >
                  <MessageCircle size={18} className="text-green-600" />
                  WhatsApp
                </button>
                <button
                  onClick={() => alert("Export via Email")}
                  className="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-100 text-left"
                >
                  <Mail size={18} className="text-blue-600" />
                  Email
                </button>
              </div>
            )}
          </div>

          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            Print
          </button>
        </div>
      </div>
    </div>
  );
};

export default FollowUpViewModal;

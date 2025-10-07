import React, { useState, useEffect, useCallback } from "react";
import { PuffLoader } from "react-spinners";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FiSearch,
  FiPlus,
  FiEdit,
  FiTrash2,
  FiX,
  FiCalendar,
  FiClock,
  FiUser,
  FiBriefcase,
  FiPhone,
  FiMail,
  FiMapPin,
  FiMoreVertical,
} from "react-icons/fi";
import axios from "axios";

const AddMeeting = () => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [customerList, setCustomerList] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [filteredMeetings, setFilteredMeetings] = useState(meetings);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [companyName, setCompanyName] = useState("");
  const [personName, setPersonName] = useState("");
  const [designation, setDesignation] = useState("");
  const [products, setProducts] = useState("");
  const [followUpStatus, setFollowUpStatus] = useState("Follow Up Required");
  const [nextFollowUpDate, setNextFollowUpDate] = useState("Sat 09 Aug, 2025");
  const [nextFollowUpTime, setNextFollowUpTime] = useState("11:36 AM");
  const [nextVisitDetails, setNextVisitDetails] = useState("");
  const [detailsOption, setDetailsOption] = useState("Send Profile");
  const [referenceProvidedBy, setReferenceProvidedBy] = useState("");
  const [referToStaff, setReferToStaff] = useState("");
  const [referToStaffList, setReferToStaffList] = useState([]);
  const [contactMethod, setContactMethod] = useState("By Visit");
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
  // Custom SVG logo components
  const TechIcon = () => (
    <svg
      className="w-7 h-7"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="50" cy="50" r="45" fill="#3B82F6" />
      <path
        d="M35 35H65V65H35V35Z"
        stroke="white"
        strokeWidth="5"
        fill="none"
      />
      <path d="M45 30V70" stroke="white" strokeWidth="5" />
      <path d="M55 30V70" stroke="white" strokeWidth="5" />
    </svg>
  );

  const DigitalIcon = () => (
    <svg
      className="w-7 h-7"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="50" cy="50" r="45" fill="#10B981" />
      <circle
        cx="50"
        cy="50"
        r="15"
        stroke="white"
        strokeWidth="5"
        fill="none"
      />
      <path d="M30 35H70" stroke="white" strokeWidth="5" />
      <path d="M30 65H70" stroke="white" strokeWidth="5" />
    </svg>
  );

  const CloudIcon = () => (
    <svg
      className="w-7 h-7"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="50" cy="50" r="45" fill="#6366F1" />
      <path
        d="M30 50C30 43 35 40 40 40C42 37 45 35 50 35C57 35 60 40 60 40C65 40 70 43 70 50C70 57 65 60 60 60H40C35 60 30 57 30 50Z"
        stroke="white"
        strokeWidth="5"
        fill="none"
      />
    </svg>
  );

  const DataIcon = () => (
    <svg
      className="w-7 h-7"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="50" cy="50" r="45" fill="#8B5CF6" />
      <path
        d="M30 40H70V60H30V40Z"
        stroke="white"
        strokeWidth="5"
        fill="none"
      />
      <circle cx="40" cy="50" r="3" fill="white" />
      <circle cx="50" cy="50" r="3" fill="white" />
      <circle cx="60" cy="50" r="3" fill="white" />
    </svg>
  );

  const WebIcon = () => (
    <svg
      className="w-7 h-7"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="50" cy="50" r="45" fill="#EC4899" />
      <circle
        cx="50"
        cy="50"
        r="15"
        stroke="white"
        strokeWidth="5"
        fill="none"
      />
      <path d="M30 50H70" stroke="white" strokeWidth="5" />
      <path d="M50 30V70" stroke="white" strokeWidth="5" />
    </svg>
  );

  const SoftwareIcon = () => (
    <svg
      className="w-7 h-7"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="50" cy="50" r="45" fill="#F59E0B" />
      <rect
        x="35"
        y="35"
        width="30"
        height="30"
        rx="5"
        stroke="white"
        strokeWidth="5"
        fill="none"
      />
      <path d="M45 45H55" stroke="white" strokeWidth="5" />
      <path d="M45 50H55" stroke="white" strokeWidth="5" />
      <path d="M45 55H55" stroke="white" strokeWidth="5" />
    </svg>
  );

  const ITIcon = () => (
    <svg
      className="w-7 h-7"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="50" cy="50" r="45" fill="#EF4444" />
      <path d="M40 40L60 60" stroke="white" strokeWidth="5" />
      <path d="M60 40L40 60" stroke="white" strokeWidth="5" />
      <circle
        cx="50"
        cy="50"
        r="10"
        stroke="white"
        strokeWidth="5"
        fill="none"
      />
    </svg>
  );

  const NetworkIcon = () => (
    <svg
      className="w-7 h-7"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="50" cy="50" r="45" fill="#06B6D4" />
      <circle cx="35" cy="35" r="5" fill="white" />
      <circle cx="65" cy="35" r="5" fill="white" />
      <circle cx="35" cy="65" r="5" fill="white" />
      <circle cx="65" cy="65" r="5" fill="white" />
      <path d="M35 35L65 65" stroke="white" strokeWidth="3" />
      <path d="M65 35L35 65" stroke="white" strokeWidth="3" />
    </svg>
  );

  const renderLogo = (logoType) => {
    switch (logoType) {
      case "TechIcon":
        return <TechIcon />;
      case "DigitalIcon":
        return <DigitalIcon />;
      case "CloudIcon":
        return <CloudIcon />;
      case "DataIcon":
        return <DataIcon />;
      case "WebIcon":
        return <WebIcon />;
      case "SoftwareIcon":
        return <SoftwareIcon />;
      case "ITIcon":
        return <ITIcon />;
      case "NetworkIcon":
        return <NetworkIcon />;
      default:
        return <TechIcon />;
    }
  };

  // Filter meetings based on search query
 useEffect(() => {
  if (!searchQuery.trim()) {
    setFilteredMeetings(meetings);
    return;
  }

  const filtered = meetings.filter((meeting) => {
    const company = meeting.companyName?.toLowerCase() || "";
    const person =
      meeting.person?.persons?.[0]?.fullName?.toLowerCase() ||
      meeting.person?.fullName?.toLowerCase() ||
      "";
    const product = meeting.product?.name?.toLowerCase() || "";
    const status = meeting.status?.toLowerCase() || "";

    return (
      company.includes(searchQuery.toLowerCase()) ||
      person.includes(searchQuery.toLowerCase()) ||
      product.includes(searchQuery.toLowerCase()) ||
      status.includes(searchQuery.toLowerCase())
    );
  });

  setFilteredMeetings(filtered);
}, [searchQuery, meetings]);


  const fetchCustomerData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/customers/companyName`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch customers");
      }
      const result = await response.json();
      setCustomerList(result.data);
    } catch (error) {
      console.error("Error fetching customers data:", error);
      toast.error("Failed to load customers data");
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 2000); // delay 2 seconds
    }
  }, []);

  useEffect(() => {
    fetchCustomerData();
  }, [fetchCustomerData]);

  // useEffect used for company selection
  useEffect(() => {
    const selectedCompany = customerList.find(
      (client) => client.companyName === companyName
    );

    if (selectedCompany) {
      setProducts(selectedCompany.assignedProducts?.name || "");

      if (selectedCompany.persons?.length === 1) {
        const onlyPerson = selectedCompany.persons[0];
        setPersonName(onlyPerson.fullName);
        setDesignation(onlyPerson.designation || "");
      } else {
        // ✅ Only reset when not editing
        if (!selectedMeeting) {
          setPersonName("");
          setDesignation("");
        }
      }
    } else {
      if (!selectedMeeting) {
        setPersonName("");
        setDesignation("");
        setProducts("");
      }
    }
  }, [companyName, customerList, selectedMeeting]);

  // Fetch meetings
  const fetchMeetingData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/meetings`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch Meeting");
      }
      const result = await response.json();
      setMeetings(result.data);
    } catch (error) {
      console.error("Error fetching Meeting data:", error);
      toast.error("Failed to load Meeting data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMeetingData();
  }, [fetchMeetingData]);

  // Fetch Staff
  const fetchStaffData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/staff`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch Staff");
      }
      const result = await response.json();
      setReferToStaffList(result.data);
    } catch (error) {
      console.error("Error fetching Staff data:", error);
      toast.error("Failed to load Staff data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStaffData();
  }, [fetchStaffData]);

  const handleAddClick = () => {
    setSelectedMeeting(null);
    setShowModal(true);
    setCompanyName("");
    setPersonName("");
    setDesignation("");
    setProducts("");
    setFollowUpStatus("Follow Up Required");
    setNextFollowUpDate("Sat 09 Aug, 2025");
    setNextFollowUpTime("11:36 AM");
    setNextVisitDetails("");
    setDetailsOption("Send Profile");
    setReferenceProvidedBy("");
    setReferToStaff("");
    setContactMethod("By Visit");
  };

  const handleEditClick = (meeting) => {
    console.log("Editing:", meeting);
    setSelectedMeeting(meeting);

    // ✅ Company name
    setCompanyName(meeting.companyName || "");

    // ✅ Find this company's full record from customerList
    const selectedCompany = customerList.find(
      (client) => client.companyName === meeting.companyName
    );

    // ✅ Try to find which person matches designation or previously selected
    let matchedPerson = "";

    if (selectedCompany?.persons?.length > 0) {
      matchedPerson =
        selectedCompany.persons.find(
          (p) =>
            p.fullName === meeting.person?.selectedPersonName ||
            p.designation === meeting.designation
        )?.fullName || "";
    }
    console.log({ matchedPerson });

    // ✅ If no match found, fallback to first person name
    setPersonName(
      matchedPerson || meeting.person?.persons?.[0]?.fullName || ""
    );
    setDesignation(meeting.designation || "");

    // ✅ Product
    setProducts(meeting.product?.name || "");

    // ✅ Status
    setFollowUpStatus(meeting.status || "Follow Up Required");

    // ✅ Follow-up Date & Time
    setNextFollowUpDate(
      meeting.followDates?.[0]
        ? new Date(meeting.followDates[0]).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
        : "Sat 09 Aug, 2025"
    );
    setNextFollowUpTime(meeting.followTimes?.[0] || "11:36 AM");

    // ✅ Visit Details & Action
    setNextVisitDetails(meeting.nextVisitDetails || meeting.details?.[0] || "");
    setDetailsOption(meeting.action || meeting.details?.[0] || "Send Profile");

    // ✅ Reference & Staff
    setReferenceProvidedBy(meeting.reference || "");
    setReferToStaff(meeting.referToStaff?.username || "");
    setContactMethod(meeting.contactMethod || "By Visit");

    setShowModal(true);
  };

 const handleDeleteClick = async (id) => {
  try {
    const headers = {
      Authorization: `Bearer ${userInfo?.token}`,
    };

    await axios.delete(
      `${import.meta.env.VITE_API_BASE_URL}/meetings/${id}`,
      { headers }
    );

    setMeetings((prev) => prev.filter((meeting) => meeting._id !== id));

    toast.success("Meeting deleted successfully!");
  } catch (error) {
    console.error(error);
    toast.error("❌ Failed to delete meeting");
  } finally {
    setTimeout(() => setLoading(false), 2000);
  }
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const selectedCompany = customerList.find(
        (c) => c.companyName === companyName
      );
      const selectedStaff = referToStaffList.find(
        (s) => s.username === referToStaff
      );

      // ✅ Conditional payload
      let payload;

      if (followUpStatus === "Follow Up Required") {
        // FULL payload
        payload = {
          companyName,
          person: selectedCompany?._id || personName,
          designation,
          product: selectedCompany?.assignedProducts?._id || products,
          status: followUpStatus,
          followDates: [nextFollowUpDate],
          followTimes: [nextFollowUpTime],
          details: [detailsOption],
          action: detailsOption,
          reference: referenceProvidedBy,
          referToStaff: selectedStaff?._id || referToStaff,
          contactMethod,
        };
      } else {
        // MINIMAL payload
        payload = {
          companyName,
          person: selectedCompany?._id || personName,
          designation,
          product: selectedCompany?.assignedProducts?._id || products,
          status: followUpStatus,
        };
      }

      const headers = {
        Authorization: `Bearer ${userInfo?.token}`,
        "Content-Type": "application/json",
      };

      if (selectedMeeting && selectedMeeting._id) {
        await axios.put(
          `${import.meta.env.VITE_API_BASE_URL}/meetings/${
            selectedMeeting._id
          }`,
          payload,
          { headers }
        );
        toast.success("✅ Meeting updated successfully");
      } else {
        await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/meetings`,
          payload,
          { headers }
        );
        toast.success("✅ Meeting added successfully");
      }

      resetForm();
      fetchMeetingData();
    } catch (error) {
      console.error(error);
      toast.error(`❌ ${selectedMeeting ? "Update" : "Add"} meeting failed`);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    // ✅ Reset form (same structure as your customer form)
    setCompanyName("");
    setPersonName("");
    setDesignation("");
    setProducts("");
    setFollowUpStatus("Follow Up Required");
    setNextFollowUpDate("Sat 09 Aug, 2025");
    setNextFollowUpTime("11:36 AM");
    setNextVisitDetails("");
    setDetailsOption("Send Profile");
    setReferenceProvidedBy("");
    setReferToStaff("");
    setContactMethod("By Visit");
    setSelectedMeeting(null);
    setShowModal(false);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedMeeting(null);
    setCompanyName("");
    setPersonName("");
    setDesignation("");
    setProducts("");
    setFollowUpStatus("Follow Up Required");
    setNextFollowUpDate("Sat 09 Aug, 2025");
    setNextFollowUpTime("11:36 AM");
    setNextVisitDetails("");
    setDetailsOption("Send Profile");
    setReferenceProvidedBy("");
    setReferToStaff("");
    setContactMethod("By Visit");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <PuffLoader color="#1d4ed8" />
      </div>
    );
  }
  console.log({ customerList });

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-newPrimary">
            Meeting Details
          </h1>
          <p className="text-gray-500 text-sm">Book your meetings</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search meetings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-newPrimary/50 focus:border-newPrimary outline-none transition-all"
            />
          </div>

          <button
            onClick={handleAddClick}
            className="bg-newPrimary text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 hover:bg-primaryDark transition-all shadow-md hover:shadow-lg"
          >
            <FiPlus className="text-lg" />
            <span>Add Meeting</span>
          </button>
        </div>
      </div>

      <div className="rounded-xl shadow p-4 md:p-6 border border-gray-100 w-full overflow-hidden">
        <div className="overflow-x-auto scrollbar-hide">
          <div className="min-w-full">
            {/* Table headers - hidden on mobile */}
            <div className="hidden md:grid grid-cols-7 gap-4 bg-gray-50 py-3 px-4 md:px-6 text-xs font-medium text-gray-500 uppercase rounded-lg">
              <div>Company Name</div>
              <div>Person</div>
              <div>Products</div>
              <div className="pl-6 ">Status</div>
              <div className="text-center">Date & Time</div>
              <div className="text-right col-span-2">Actions</div>
            </div>

            <div className="mt-4 flex flex-col gap-3 pb-14">
              {filteredMeetings.map((meeting, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 md:grid-cols-7 items-center gap-4 bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition border border-gray-100"
                >
                  <div className="hidden md:block text-sm font-medium text-gray-900 truncate">
                    {meeting.companyName}
                  </div>

                  <div className="hidden md:block text-sm text-gray-500 truncate">
                    {meeting.person?.persons?.[0]?.fullName || "—"}
                  </div>

                  <div className="hidden md:block text-sm text-gray-500 truncate">
                    {meeting.product?.name || "—"}
                  </div>

                  <div className="hidden md:block pl-6">
                    <div
                      className={`max-w-fit truncate items-center px-3 py-1 rounded-full text-xs font-medium ${
                        meeting.status === "Follow Up Required"
                          ? "bg-yellow-100 text-yellow-800"
                          : meeting.status === "Not Interested"
                          ? "bg-red-100 text-red-800"
                          : meeting.status === "All Ready Installed"
                          ? "bg-green-100 text-green-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {meeting.status}
                    </div>
                  </div>

                  <div className="text-sm text-gray-500 text-center">
                    {meeting.followDates?.length
                      ? new Date(meeting.followDates[0]).toLocaleDateString()
                      : "—"}
                    {" • "}
                    {meeting.followTimes?.[0] || "—"}
                  </div>

                  <div className="flex justify-end md:justify-end col-span-1 md:col-span-2">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditClick(meeting)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                      >
                        <FiEdit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(meeting._id)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-newPrimary">
                {selectedMeeting ? "Edit Meeting" : "Add Meeting"}
              </h2>
              <button
                className="w-6 h-6 text-white rounded-full flex justify-center items-center hover:text-gray-400 text-xl bg-newPrimary"
                onClick={handleCloseModal}
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">
                    Company Name
                  </label>
                  <select
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-newPrimary/50 focus:border-newPrimary transition-all"
                    required
                  >
                    <option value="">Select Company</option>
                    {customerList.map((client) => (
                      <option key={client._id} value={client.companyName}>
                        {client.companyName}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">
                    Person
                  </label>
                  <div className="relative">
                    <FiUser className="absolute left-3 top-3 text-gray-400" />
                    {(() => {
                      const selectedCompany = customerList.find(
                        (client) => client.companyName === companyName
                      );

                      // If only one person, show input field
                      if (selectedCompany?.persons?.length === 1) {
                        const onlyPerson = selectedCompany.persons[0];
                        return (
                          <input
                            type="text"
                            readOnly
                            value={onlyPerson.fullName}
                            className="w-full pl-10 pr-4 p-2.5 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none"
                          />
                        );
                      }

                      // If multiple, show select field
                      return (
                        <select
                          value={personName}
                          onChange={(e) => {
                            setPersonName(e.target.value);
                            const personObj = selectedCompany?.persons?.find(
                              (p) => p.fullName === e.target.value
                            );
                            setDesignation(personObj?.designation || "");
                          }}
                          disabled={!companyName}
                          className="w-full pl-10 pr-4 p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-newPrimary/50 focus:border-newPrimary transition-all"
                        >
                          <option value="">Select person</option>
                          {selectedCompany?.persons?.map((p, idx) => (
                            <option key={idx} value={p.fullName}>
                              {p.fullName}
                            </option>
                          ))}
                        </select>
                      );
                    })()}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">
                    Designation
                  </label>
                  <div className="relative">
                    <FiBriefcase className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="text"
                      value={designation}
                      onChange={(e) => setDesignation(e.target.value)}
                      className="w-full pl-10 pr-4 p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-newPrimary/50 focus:border-newPrimary transition-all"
                      placeholder="Operator"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">
                    Products
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={products}
                    className="w-full p-2.5 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none"
                    placeholder="Auto-filled product"
                  />
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-4">Status</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="status"
                      value="Follow Up Required"
                      checked={followUpStatus === "Follow Up Required"}
                      onChange={(e) => setFollowUpStatus(e.target.value)}
                      className="mr-2 text-newPrimary focus:ring-newPrimary"
                    />
                    Follow Up Required
                  </label>
                  <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="status"
                      value="Not Interested"
                      checked={followUpStatus === "Not Interested"}
                      onChange={(e) => setFollowUpStatus(e.target.value)}
                      className="mr-2 text-newPrimary focus:ring-newPrimary"
                    />
                    Not Interested
                  </label>
                  <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="status"
                      value="All Ready Installed"
                      checked={followUpStatus === "All Ready Installed"}
                      onChange={(e) => setFollowUpStatus(e.target.value)}
                      className="mr-2 text-newPrimary focus:ring-newPrimary"
                    />
                    Already Installed
                  </label>
                  <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="status"
                      value="Phone Number Responding"
                      checked={followUpStatus === "Phone Number Responding"}
                      onChange={(e) => setFollowUpStatus(e.target.value)}
                      className="mr-2 text-newPrimary focus:ring-newPrimary"
                    />
                    Phone Responding
                  </label>
                </div>
              </div>
              {followUpStatus === "Follow Up Required" && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div>
                      <label className="block text-gray-700 mb-2 font-medium">
                        Next Follow-up Date
                      </label>
                      <div className="relative">
                        <FiCalendar className="absolute left-3 top-3 text-gray-400" />
                        <select
                          value={nextFollowUpDate}
                          onChange={(e) => setNextFollowUpDate(e.target.value)}
                          className="w-full pl-10 pr-4 p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-newPrimary/50 focus:border-newPrimary transition-all"
                        >
                          <option value="Sat 09 Aug, 2025">
                            Sat 09 Aug, 2025
                          </option>
                          <option value="Sun 10 Aug, 2025">
                            Sun 10 Aug, 2025
                          </option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2 font-medium">
                        Time
                      </label>
                      <div className="relative">
                        <FiClock className="absolute left-3 top-3 text-gray-400" />
                        <select
                          value={nextFollowUpTime}
                          onChange={(e) => setNextFollowUpTime(e.target.value)}
                          className="w-full pl-10 pr-4 p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-newPrimary/50 focus:border-newPrimary transition-all"
                        >
                          <option value="11:36 AM">11:36 AM</option>
                          <option value="12:00 PM">12:00 PM</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2 font-medium">
                      Next Visit Details
                    </label>
                    <textarea
                      value={nextVisitDetails}
                      onChange={(e) => setNextVisitDetails(e.target.value)}
                      className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-newPrimary/50 focus:border-newPrimary transition-all"
                      placeholder="Write here..."
                      rows="3"
                    />
                  </div>

                  <div className="border rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-4">Actions</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                        <input
                          type="radio"
                          name="details"
                          value="Send Profile"
                          checked={detailsOption === "Send Profile"}
                          onChange={(e) => setDetailsOption(e.target.value)}
                          className="mr-2 text-newPrimary focus:ring-newPrimary"
                        />
                        Send Profile
                      </label>
                      <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                        <input
                          type="radio"
                          name="details"
                          value="Send Quotation"
                          checked={detailsOption === "Send Quotation"}
                          onChange={(e) => setDetailsOption(e.target.value)}
                          className="mr-2 text-newPrimary focus:ring-newPrimary"
                        />
                        Send Quotation
                      </label>
                      <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                        <input
                          type="radio"
                          name="details"
                          value="Product Information"
                          checked={detailsOption === "Product Information"}
                          onChange={(e) => setDetailsOption(e.target.value)}
                          className="mr-2 text-newPrimary focus:ring-newPrimary"
                        />
                        Product Information
                      </label>
                      <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                        <input
                          type="radio"
                          name="details"
                          value="Require Visit/Meeting"
                          checked={detailsOption === "Require Visit/Meeting"}
                          onChange={(e) => setDetailsOption(e.target.value)}
                          className="mr-2 text-newPrimary focus:ring-newPrimary"
                        />
                        Require Visit/Meeting
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div>
                      <label className="block text-gray-700 mb-2 font-medium">
                        Reference Provided By
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={referenceProvidedBy}
                          onChange={(e) =>
                            setReferenceProvidedBy(e.target.value)
                          }
                          placeholder="Enter reference name"
                          className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-newPrimary/50 focus:border-newPrimary transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-700 mb-2 font-medium">
                        Refer To Staff
                      </label>
                      <select
                        value={referToStaff}
                        onChange={(e) => setReferToStaff(e.target.value)}
                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-newPrimary/50 focus:border-newPrimary transition-all"
                      >
                        <option value="">Select Staff</option>
                        {referToStaffList?.map((staff) => (
                          <option key={staff._id} value={staff.username}>
                            {staff.username}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-4">
                      Contact Method
                    </h3>
                    <div className="flex flex-col sm:flex-row flex-wrap gap-3">
                      <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                        <input
                          type="radio"
                          name="contact"
                          value="By Visit"
                          checked={contactMethod === "By Visit"}
                          onChange={(e) => setContactMethod(e.target.value)}
                          className="mr-2 text-newPrimary focus:ring-newPrimary"
                        />
                        <FiMapPin className="mr-1 text-gray-500" />
                        By Visit
                      </label>
                      <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                        <input
                          type="radio"
                          name="contact"
                          value="By Phone"
                          checked={contactMethod === "By Phone"}
                          onChange={(e) => setContactMethod(e.target.value)}
                          className="mr-2 text-newPrimary focus:ring-newPrimary"
                        />
                        <FiPhone className="mr-1 text-gray-500" />
                        By Phone
                      </label>
                      <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                        <input
                          type="radio"
                          name="contact"
                          value="By Email"
                          checked={contactMethod === "By Email"}
                          onChange={(e) => setContactMethod(e.target.value)}
                          className="mr-2 text-newPrimary focus:ring-newPrimary"
                        />
                        <FiMail className="mr-1 text-gray-500" />
                        By Email
                      </label>
                    </div>
                  </div>
                </>
              )}

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 md:px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-newPrimary text-white px-4 md:px-6 py-2 rounded-lg hover:bg-primaryDark transition-colors duration-200"
                >
                  {loading
                    ? "Saving..."
                    : selectedMeeting
                    ? "Update Meeting"
                    : "Save Meeting"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default AddMeeting;

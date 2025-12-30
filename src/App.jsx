import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/admin/Login";
import Signup from "./pages/admin/Signup";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import StaffList from "./pages/admin/StaffList";
import CustomerData from "./pages/admin/CustomerData";
import FollowUp from "./pages/admin/FollowUp";
import ProductsPage from "./pages/admin/ProductsPage";
import AddProduct from "./pages/admin/AddProduct";
import { ToastContainer } from "react-toastify";
import Calendar from "./pages/admin/Calendar";
import "react-toastify/dist/ReactToastify.css";
import AddMeeting from "./pages/admin/AddMeeting";
import Category from "./pages/admin/Category";
import ProtectedRoute from "./components/ProtectedRoute";
import MeetingFollowPage from "./components/Dashboard/followupmodel";
import GroupManagement from "./pages/admin/GroupManagement";
import Users from "./pages/admin/Users";
import AssignRights from "./pages/admin/AccessControl";
import Modules from "./pages/admin/Modules";
import ModulesFunctionalities from "./pages/admin/ModulesFunctionalities";
import SuccessClient from "./pages/admin/SuccessClient";
import AssignTo from "./pages/admin/AssignTo";
import ActivityTrack from "./pages/History/ActivityTrack";
import CustomerTrack from "./pages/History/CustomerTrack";
import MeetingTrack from "./pages/History/MeetingTrack";
import FollowUpTrack from "./pages/History/FollowUpTrack";
import SuccessClientTrack from "./pages/History/SuccessClientTrack";
import StaffTrack from "./pages/History/StaffTrack";
import Profile from "./pages/admin/Settings/Profile";
import MeetingCallsTrack from "./pages/admin/MeetingCallsTrack";
import Landing from "./pages/Landing";
function AppContent() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<Landing />} />

          {/* Admin Routes */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="staff" element={<StaffList />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="products/add" element={<AddProduct />} />
            {/* <Route path="more-product-assign" element={<MoreProductAssign />} /> */}
            <Route path="customers" element={<CustomerData />} />
            <Route path="assign" element={<AssignTo />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="followup" element={<FollowUp />} />
            <Route path="success-client" element={<SuccessClient />} />
            <Route path="meetingup" element={<MeetingFollowPage />} />
            <Route path="meetings/add" element={<AddMeeting />} />
            <Route path="category" element={<Category />} />

            {/* Security */}
            <Route path="groups" element={<GroupManagement />} />
            <Route path="users" element={<Users />} />

            {/* History */}
            <Route path="history" element={<ActivityTrack />} />
            <Route path="history/customers" element={<CustomerTrack />} />
            <Route path="history/meetings" element={<MeetingTrack />} />
            <Route path="meetings-tracking" element={<MeetingCallsTrack />} />
            <Route path="history/followups" element={<FollowUpTrack />} />
            <Route path="history/success" element={<SuccessClientTrack />} />
            <Route path="history/staff" element={<StaffTrack />} />

            {/* Settings */}
             <Route path="settings/profile" element={<Profile />} />

            <Route path="access-rights" element={<AssignRights />} />
            <Route path="modules" element={<Modules />} />
            <Route
              path="modules-functionalities"
              element={<ModulesFunctionalities />}
            />
          </Route>
        </Routes>
      </main>
      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
}

function App() {
  return <AppContent />;
}

export default App;

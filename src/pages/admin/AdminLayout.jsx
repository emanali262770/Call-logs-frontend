// src/pages/admin/AdminLayout.jsx
import React from "react";
import AdminSidebar from "./AdminSidebar";
import { Outlet } from "react-router-dom";

const AdminLayout = () => (
  <div className="flex h-screen overflow-hidden">
  {/* Sidebar */}
  <AdminSidebar />

  {/* Main Content */}
  <main className="flex-1 flex flex-col bg-gray-50 overflow-hidden">
    {/* Page Content */}
    <div className="flex-1 overflow-y-auto p-4">
      <Outlet />
    </div>
  </main>
</div>

);

export default AdminLayout;

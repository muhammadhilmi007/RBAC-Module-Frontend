"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";

export default function EmployeesPage() {
  return (
    <DashboardLayout>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Manajemen Employees</h1>
          <p className="text-gray-600">Kelola data Karyawan perusahaan</p>
        </div>
      </div>
    </DashboardLayout>
  );
}

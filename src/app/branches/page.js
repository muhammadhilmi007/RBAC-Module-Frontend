'use client';

import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import PermissionGate from '@/components/auth/PermissionGate';
import Button from '@/components/ui/Button';
import Table from '@/components/ui/Table';
import Card from '@/components/ui/Card';
import { FiPlus, FiEdit, FiTrash2, FiEye, FiMapPin, FiUsers, FiDollarSign } from 'react-icons/fi';

// Sample data untuk demo
const BRANCHES_DATA = [
  { 
    id: 1, 
    name: 'Kantor Pusat', 
    location: 'Jakarta', 
    address: 'Jl. Sudirman No. 123, Jakarta Pusat', 
    manager: 'Direktur Utama', 
    employees: 50, 
    status: 'Aktif' 
  },
  { 
    id: 2, 
    name: 'Cabang Jakarta', 
    location: 'Jakarta', 
    address: 'Jl. Gatot Subroto No. 45, Jakarta Selatan', 
    manager: 'Kepala Cabang Jakarta', 
    employees: 32, 
    status: 'Aktif' 
  },
  { 
    id: 3, 
    name: 'Cabang Bandung', 
    location: 'Bandung', 
    address: 'Jl. Asia Afrika No. 78, Bandung', 
    manager: 'Kepala Cabang Bandung', 
    employees: 18, 
    status: 'Aktif' 
  },
  { 
    id: 4, 
    name: 'Cabang Surabaya', 
    location: 'Surabaya', 
    address: 'Jl. Pemuda No. 55, Surabaya', 
    manager: 'Kepala Cabang Surabaya', 
    employees: 25, 
    status: 'Aktif' 
  },
  { 
    id: 5, 
    name: 'Cabang Makassar', 
    location: 'Makassar', 
    address: 'Jl. Urip Sumoharjo No. 99, Makassar', 
    manager: 'Pjs. Kepala Cabang Makassar', 
    employees: 15, 
    status: 'Pembangunan' 
  }
];

export default function BranchesPage() {
  return (
    <DashboardLayout>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Manajemen Cabang</h1>
          <p className="text-gray-600">Kelola data cabang perusahaan</p>
        </div>
        
        {/* Tombol Tambah Cabang - hanya muncul jika punya permission Create */}
        <PermissionGate featureName="Manajemen Cabang" permissionName="Create">
          <Button variant="primary" className="flex items-center">
            <FiPlus className="mr-2" />
            Tambah Cabang
          </Button>
        </PermissionGate>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-500 text-white mr-4">
              <FiMapPin size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Total Cabang</h3>
              <p className="text-2xl font-bold text-blue-600">5</p>
            </div>
          </div>
        </Card>
        
        <Card className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-500 text-white mr-4">
              <FiUsers size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Total Karyawan</h3>
              <p className="text-2xl font-bold text-green-600">140</p>
            </div>
          </div>
        </Card>
        
        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-500 text-white mr-4">
              <FiDollarSign size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Rata-rata Pendapatan</h3>
              <p className="text-2xl font-bold text-purple-600">Rp 1.5M</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Daftar Cabang */}
      <Card>
        <Card.Header className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Daftar Cabang</h2>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Cari cabang..."
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </Card.Header>
        <div className="overflow-x-auto">
          <Table>
            <Table.Head>
              <Table.HeadRow>
                <Table.HeadCell>ID</Table.HeadCell>
                <Table.HeadCell>Nama Cabang</Table.HeadCell>
                <Table.HeadCell>Lokasi</Table.HeadCell>
                <Table.HeadCell>Kepala Cabang</Table.HeadCell>
                <Table.HeadCell>Karyawan</Table.HeadCell>
                <Table.HeadCell>Status</Table.HeadCell>
                <Table.HeadCell className="text-right">Aksi</Table.HeadCell>
              </Table.HeadRow>
            </Table.Head>
            <Table.Body>
              {BRANCHES_DATA.map((branch) => (
                <Table.Row key={branch.id}>
                  <Table.Cell className="text-gray-500">#{branch.id}</Table.Cell>
                  <Table.Cell className="font-medium text-gray-900">{branch.name}</Table.Cell>
                  <Table.Cell>{branch.location}</Table.Cell>
                  <Table.Cell>{branch.manager}</Table.Cell>
                  <Table.Cell>{branch.employees}</Table.Cell>
                  <Table.Cell>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      branch.status === 'Aktif' 
                        ? 'bg-green-100 text-green-800' 
                        : branch.status === 'Pembangunan'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                    }`}>
                      {branch.status}
                    </span>
                  </Table.Cell>
                  <Table.Cell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      {/* View button - hanya muncul jika punya permission View */}
                      <PermissionGate featureName="Manajemen Cabang" permissionName="View">
                        <Button variant="light" size="sm" className="text-blue-600">
                          <FiEye size={16} />
                        </Button>
                      </PermissionGate>
                      
                      {/* Edit button - hanya muncul jika punya permission Edit */}
                      <PermissionGate featureName="Manajemen Cabang" permissionName="Edit">
                        <Button variant="light" size="sm" className="text-indigo-600">
                          <FiEdit size={16} />
                        </Button>
                      </PermissionGate>
                      
                      {/* Delete button - hanya muncul jika punya permission Delete */}
                      <PermissionGate featureName="Manajemen Cabang" permissionName="Delete">
                        <Button variant="light" size="sm" className="text-red-600">
                          <FiTrash2 size={16} />
                        </Button>
                      </PermissionGate>
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
        <Card.Footer className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Menampilkan 1-5 dari 5 cabang
          </div>
          <div className="flex space-x-1">
            <Button variant="light" size="sm" disabled>
              Sebelumnya
            </Button>
            <Button variant="primary" size="sm">
              1
            </Button>
            <Button variant="light" size="sm" disabled>
              Selanjutnya
            </Button>
          </div>
        </Card.Footer>
      </Card>
    </DashboardLayout>
  );
}
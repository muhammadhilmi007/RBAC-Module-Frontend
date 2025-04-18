'use client';

import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import PermissionGate from '@/components/auth/PermissionGate';
import Button from '@/components/ui/Button';
import Table from '@/components/ui/Table';
import Card from '@/components/ui/Card';
import { FiPlus, FiEdit, FiTrash2, FiEye } from 'react-icons/fi';

// Sample data untuk demo
const USERS_DATA = [
  { id: 1, name: 'Direktur Utama', email: 'direktur@example.com', role: 'Super Admin', status: 'Aktif' },
  { id: 2, name: 'Kepala Cabang Jakarta', email: 'cabang.jakarta@example.com', role: 'Kepala Cabang', status: 'Aktif' },
  { id: 3, name: 'Admin', email: 'admin@example.com', role: 'Admin', status: 'Aktif' },
  { id: 4, name: 'Kepala Cabang Bandung', email: 'cabang.bandung@example.com', role: 'Kepala Cabang', status: 'Aktif' },
  { id: 5, name: 'Staff Keuangan', email: 'keuangan@example.com', role: 'Staff', status: 'Non-aktif' }
];

export default function UsersPage() {
  return (
    <DashboardLayout>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Manajemen Pengguna</h1>
          <p className="text-gray-600">Kelola data pengguna sistem</p>
        </div>
        
        {/* Tombol Tambah Pengguna - hanya muncul jika punya permission Create */}
        <PermissionGate featureName="Manajemen Pengguna" permissionName="Create">
          <Button variant="primary" className="flex items-center">
            <FiPlus className="mr-2" />
            Tambah Pengguna
          </Button>
        </PermissionGate>
      </div>

      <Card>
        <Card.Header className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Daftar Pengguna</h2>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Cari pengguna..."
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </Card.Header>
        <div className="overflow-x-auto">
          <Table>
            <Table.Head>
              <Table.HeadRow>
                <Table.HeadCell>ID</Table.HeadCell>
                <Table.HeadCell>Nama</Table.HeadCell>
                <Table.HeadCell>Email</Table.HeadCell>
                <Table.HeadCell>Role</Table.HeadCell>
                <Table.HeadCell>Status</Table.HeadCell>
                <Table.HeadCell className="text-right">Aksi</Table.HeadCell>
              </Table.HeadRow>
            </Table.Head>
            <Table.Body>
              {USERS_DATA.map((user) => (
                <Table.Row key={user.id}>
                  <Table.Cell className="text-gray-500">#{user.id}</Table.Cell>
                  <Table.Cell className="font-medium text-gray-900">{user.name}</Table.Cell>
                  <Table.Cell>{user.email}</Table.Cell>
                  <Table.Cell>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      user.role === 'Super Admin' 
                        ? 'bg-purple-100 text-purple-800' 
                        : user.role === 'Kepala Cabang'
                          ? 'bg-blue-100 text-blue-800'
                          : user.role === 'Admin'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                    }`}>
                      {user.role}
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      user.status === 'Aktif' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {user.status}
                    </span>
                  </Table.Cell>
                  <Table.Cell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      {/* View button - hanya muncul jika punya permission View */}
                      <PermissionGate featureName="Manajemen Pengguna" permissionName="View">
                        <Button variant="light" size="sm" className="text-blue-600">
                          <FiEye size={16} />
                        </Button>
                      </PermissionGate>
                      
                      {/* Edit button - hanya muncul jika punya permission Edit */}
                      <PermissionGate featureName="Manajemen Pengguna" permissionName="Edit">
                        <Button variant="light" size="sm" className="text-indigo-600">
                          <FiEdit size={16} />
                        </Button>
                      </PermissionGate>
                      
                      {/* Delete button - hanya muncul jika punya permission Delete */}
                      <PermissionGate featureName="Manajemen Pengguna" permissionName="Delete">
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
            Menampilkan 1-5 dari 5 pengguna
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
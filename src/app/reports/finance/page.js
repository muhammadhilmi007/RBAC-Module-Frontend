'use client';

import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import PermissionGate from '@/components/auth/PermissionGate';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { FiDownload, FiPrinter, FiBarChart2, FiPieChart, FiTrendingUp, FiDollarSign } from 'react-icons/fi';

export default function FinanceReportPage() {
  return (
    <DashboardLayout>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Laporan Keuangan</h1>
          <p className="text-gray-600">Analisis dan laporan data keuangan</p>
        </div>
        
        <div className="flex space-x-2">
          {/* Export button - hanya muncul jika punya permission View */}
          <PermissionGate featureName="Laporan Keuangan" permissionName="View">
            <Button variant="secondary" className="flex items-center">
              <FiDownload className="mr-2" />
              Export
            </Button>
          </PermissionGate>
          
          {/* Print button - hanya muncul jika punya permission View */}
          <PermissionGate featureName="Laporan Keuangan" permissionName="View">
            <Button variant="secondary" className="flex items-center">
              <FiPrinter className="mr-2" />
              Print
            </Button>
          </PermissionGate>
        </div>
      </div>
      
      {/* Filter dan periode */}
      <Card className="mb-6">
        <div className="flex flex-wrap items-center justify-between">
          <div className="flex items-center space-x-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Periode</label>
              <select className="border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500">
                <option>Bulanan</option>
                <option>Kuartalan</option>
                <option>Tahunan</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dari</label>
              <input type="date" className="border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sampai</label>
              <input type="date" className="border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" />
            </div>
          </div>
          <div className="mt-4 md:mt-0">
            <Button variant="primary" className="w-full md:w-auto">
              Terapkan Filter
            </Button>
          </div>
        </div>
      </Card>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-white border-l-4 border-blue-500">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
              <FiDollarSign size={20} />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Pendapatan</p>
              <p className="text-xl font-bold">Rp 8.5M</p>
              <p className="text-green-500 text-xs flex items-center">
                <FiTrendingUp className="mr-1" /> +8.2%
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="bg-white border-l-4 border-green-500">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
              <FiDollarSign size={20} />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Profit</p>
              <p className="text-xl font-bold">Rp 3.2M</p>
              <p className="text-green-500 text-xs flex items-center">
                <FiTrendingUp className="mr-1" /> +5.1%
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="bg-white border-l-4 border-yellow-500">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
              <FiDollarSign size={20} />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Biaya</p>
              <p className="text-xl font-bold">Rp 5.3M</p>
              <p className="text-red-500 text-xs flex items-center">
                <FiTrendingUp className="mr-1" /> +2.8%
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="bg-white border-l-4 border-purple-500">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
              <FiDollarSign size={20} />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Margin</p>
              <p className="text-xl font-bold">37.6%</p>
              <p className="text-green-500 text-xs flex items-center">
                <FiTrendingUp className="mr-1" /> +1.2%
              </p>
            </div>
          </div>
        </Card>
      </div>
      
      {/* Grafik & Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Chart 1: Pendapatan Bulanan */}
        <Card>
          <Card.Header>
            <h3 className="text-lg font-semibold text-gray-800">Pendapatan Bulanan</h3>
          </Card.Header>
          <div className="p-4">
            <div className="h-64 flex items-end justify-around">
              {[65, 40, 75, 50, 85, 70, 60, 90, 80, 75, 70, 85].map((height, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div 
                    className="w-6 bg-blue-500 rounded-t"
                    style={{ height: `${height}%` }}
                  ></div>
                  <span className="text-xs mt-1 text-gray-500">
                    {['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'][index]}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <Card.Footer className="flex justify-between items-center text-sm text-gray-600">
            <span>Sumber: Data Keuangan 2024</span>
            <Button variant="light" size="sm" className="flex items-center">
              <FiBarChart2 className="mr-1" />
              Detail
            </Button>
          </Card.Footer>
        </Card>
        
        {/* Chart 2: Distribusi Pengeluaran */}
        <Card>
          <Card.Header>
            <h3 className="text-lg font-semibold text-gray-800">Distribusi Pengeluaran</h3>
          </Card.Header>
          <div className="p-4 flex justify-center">
            <div className="relative w-48 h-48">
              {/* Simplified pie chart using conic-gradient */}
              <div 
                className="w-full h-full rounded-full"
                style={{ 
                  background: 'conic-gradient(#3b82f6 0% 30%, #10b981 30% 55%, #f59e0b 55% 70%, #ef4444 70% 85%, #8b5cf6 85% 100%)',
                  boxShadow: 'inset 0 0 0 10px white'
                }}
              ></div>
              {/* Center hole */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-white rounded-full"></div>
            </div>
            <div className="ml-6 flex flex-col justify-center space-y-2">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                <span className="text-sm">Operasional (30%)</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm">Gaji (25%)</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                <span className="text-sm">Marketing (15%)</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                <span className="text-sm">Infrastruktur (15%)</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                <span className="text-sm">Lainnya (15%)</span>
              </div>
            </div>
          </div>
          <Card.Footer className="flex justify-between items-center text-sm text-gray-600">
            <span>Sumber: Data Keuangan 2024</span>
            <Button variant="light" size="sm" className="flex items-center">
              <FiPieChart className="mr-1" />
              Detail
            </Button>
          </Card.Footer>
        </Card>
      </div>
      
      {/* Table: Rekap Keuangan per Cabang */}
      <Card>
        <Card.Header>
          <h3 className="text-lg font-semibold text-gray-800">Rekap Keuangan per Cabang</h3>
        </Card.Header>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cabang</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Pendapatan</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Pengeluaran</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Profit</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Margin</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">YoY</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[
                { name: 'Kantor Pusat', revenue: 'Rp 3.2M', expenses: 'Rp 2.1M', profit: 'Rp 1.1M', margin: '34.4%', yoy: '+12.3%', yoyColor: 'text-green-600' },
                { name: 'Cabang Jakarta', revenue: 'Rp 2.5M', expenses: 'Rp 1.4M', profit: 'Rp 1.1M', margin: '44.0%', yoy: '+8.7%', yoyColor: 'text-green-600' },
                { name: 'Cabang Bandung', revenue: 'Rp 1.2M', expenses: 'Rp 0.8M', profit: 'Rp 0.4M', margin: '33.3%', yoy: '+5.2%', yoyColor: 'text-green-600' },
                { name: 'Cabang Surabaya', revenue: 'Rp 1.4M', expenses: 'Rp 0.9M', profit: 'Rp 0.5M', margin: '35.7%', yoy: '-2.1%', yoyColor: 'text-red-600' },
                { name: 'Cabang Makassar', revenue: 'Rp 0.2M', expenses: 'Rp 0.1M', profit: 'Rp 0.1M', margin: '50.0%', yoy: 'N/A', yoyColor: 'text-gray-600' }
              ].map((branch, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{branch.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-800">{branch.revenue}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-800">{branch.expenses}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900">{branch.profit}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-800">{branch.margin}</td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-medium ${branch.yoyColor}`}>{branch.yoy}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Total</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold text-gray-900">Rp 8.5M</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold text-gray-900">Rp 5.3M</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold text-gray-900">Rp 3.2M</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold text-gray-900">37.6%</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold text-green-600">+7.5%</td>
              </tr>
            </tfoot>
          </table>
        </div>
        <Card.Footer className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Data per April 2025
          </div>
          <Button variant="primary" size="sm" className="flex items-center">
            <FiDownload className="mr-1" />
            Export Data
          </Button>
        </Card.Footer>
      </Card>
    </DashboardLayout>
  );
}
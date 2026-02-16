'use client';

import { useEffect, useState } from 'react';
import DashboardCard from '@/components/admin/DashboardCard';
import {
  Hotel,
  Car,
  Package,
  ShoppingCart,
  TrendingUp,
  Users,
} from 'lucide-react';
import { apiClient } from '@/src/services/api';
import toast from 'react-hot-toast';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface DashboardStats {
  totalHotels: number;
  totalTransports: number;
  totalPaketTours: number;
  totalBookings: number;
  totalRevenue: number;
  totalCustomers: number;
}

interface ChartData {
  salesData: any[];
  bookingTrendData: any[];
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, chartsRes] = await Promise.all([
          apiClient.getDashboardStats(),
          apiClient.getDashboardCharts(),
        ]);
        setStats(statsRes);
        setChartData(chartsRes);
      } catch (error: any) {
        const message = error.response?.data?.message || 'Failed to load dashboard data';
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Mock data for now (replace with actual API data)
  const mockStats = stats || {
    totalHotels: 12,
    totalTransports: 8,
    totalPaketTours: 15,
    totalBookings: 48,
    totalRevenue: 125000000,
    totalCustomers: 156,
  };

  const mockSalesData = [
    { month: 'Jan', revenue: 4000 },
    { month: 'Feb', revenue: 3000 },
    { month: 'Mar', revenue: 2000 },
    { month: 'Apr', revenue: 2780 },
    { month: 'May', revenue: 1890 },
    { month: 'Jun', revenue: 2390 },
  ];

  const mockBookingData = [
    { date: '1-7', bookings: 24 },
    { date: '8-14', bookings: 13 },
    { date: '15-21', bookings: 98 },
    { date: '22-28', bookings: 39 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's your business overview.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardCard
          title="Total Hotels"
          value={mockStats.totalHotels}
          icon={<Hotel size={24} />}
          color="blue"
          trend={{ value: 12, direction: 'up' }}
        />
        <DashboardCard
          title="Total Transport"
          value={mockStats.totalTransports}
          icon={<Car size={24} />}
          color="green"
          trend={{ value: 5, direction: 'up' }}
        />
        <DashboardCard
          title="Total Paket Tours"
          value={mockStats.totalPaketTours}
          icon={<Package size={24} />}
          color="yellow"
          trend={{ value: 8, direction: 'up' }}
        />
        <DashboardCard
          title="Total Bookings"
          value={mockStats.totalBookings}
          icon={<ShoppingCart size={24} />}
          color="purple"
          trend={{ value: 25, direction: 'up' }}
        />
        <DashboardCard
          title="Total Revenue"
          value={`Rp ${(mockStats.totalRevenue / 1000000).toFixed(0)}M`}
          icon={<TrendingUp size={24} />}
          color="green"
          trend={{ value: 18, direction: 'up' }}
        />
        <DashboardCard
          title="Total Customers"
          value={mockStats.totalCustomers}
          icon={<Users size={24} />}
          color="red"
          trend={{ value: 3, direction: 'up' }}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={mockSalesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#3b82f6"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Booking Chart */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Booking Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mockBookingData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="bookings" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Bookings</h3>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="flex items-center justify-between p-3 border border-gray-100 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-900">Booking #{1000 + item}</p>
                  <p className="text-sm text-gray-600">John Doe</p>
                </div>
                <span className="px-3 py-1 bg-green-50 text-green-700 text-sm font-medium rounded-full">
                  Confirmed
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Performance</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-700">Booking Rate</p>
                <p className="font-semibold text-gray-900">85%</p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: '85%' }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-700">Occupancy Rate</p>
                <p className="font-semibold text-gray-900">72%</p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: '72%' }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-700">Customer Satisfaction</p>
                <p className="font-semibold text-gray-900">92%</p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-purple-500 h-2 rounded-full"
                  style={{ width: '92%' }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

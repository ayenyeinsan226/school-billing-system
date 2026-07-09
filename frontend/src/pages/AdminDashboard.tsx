import React, { useState, useEffect } from 'react';
import { DashboardStats, InvoiceListItem } from '../types/billing';

export default function AdminDashboard() {
  // Real-world မှာ API က လာမည့် state များကို ဖန်တီးခြင်း
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [invoices, setInvoices] = useState<InvoiceListItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // API ဆီက ဒေတာ လှမ်းယူသကဲ့သို့ ပုံတူလုပ်ခြင်း (Simulating API Fetch)
    const fetchDashboardData = () => {
      setTimeout(() => {
        setStats({
          totalStudents: 1240,
          monthlyRevenue: 45200,
          pendingInvoicesCount: 32,
        });

        setInvoices([
          { id: 'INV-001', studentName: 'Su Su', amount: 150, status: 'Paid' },
          { id: 'INV-002', studentName: 'Aung Aung', amount: 200, status: 'Pending' },
          { id: 'INV-003', studentName: 'Thiri', amount: 150, status: 'Overdue' },
        ]);
        
        setLoading(false);
      }, 800); // 0.8 စက္ကန့် စောင့်ပြီး ဒေတာပြခြင်း
    };

    fetchDashboardData();
  }, []);

  // ဒေတာ ဆွဲနေတုန်း ပြသမည့် Loading State (Real-world မှာ မပါမဖြစ်ပါ)
  if (loading) {
    return (
      <div className="flex-1 p-8 bg-slate-50 min-h-screen flex items-center justify-center">
        <p className="text-lg font-medium text-slate-500 animate-pulse">Loading dashboard status...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8 bg-slate-50 min-h-screen">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">School Overview</h1>
        <p className="text-slate-500">Welcome back, here is today's financial status.</p>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500">
          <p className="text-sm font-medium text-slate-400 uppercase">Total Students</p>
          <p className="text-3xl font-bold text-slate-700 mt-2">{stats?.totalStudents.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-emerald-500">
          <p className="text-sm font-medium text-slate-400 uppercase">Monthly Revenue</p>
          <p className="text-3xl font-bold text-slate-700 mt-2">${stats?.monthlyRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-rose-500">
          <p className="text-sm font-medium text-slate-400 uppercase">Pending Invoices</p>
          <p className="text-3xl font-bold text-slate-700 mt-2">{stats?.pendingInvoicesCount}</p>
        </div>
      </div>

      {/* Recent Invoices Table */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Recent Billing Transactions</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 text-sm">
                <th className="pb-3">Invoice ID</th>
                <th className="pb-3">Student</th>
                <th className="pb-3">Amount</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody className="text-slate-600 divide-y divide-slate-100">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3 font-medium text-indigo-600">{inv.id}</td>
                  <td className="py-3">{inv.studentName}</td>
                  <td className="py-3 font-semibold">${inv.amount}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      inv.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' :
                      inv.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
                    }`}>
                      {inv.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
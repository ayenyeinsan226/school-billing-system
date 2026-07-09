import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Sidebar() {
  const location = useLocation();

  // Active Menu Link ကို အရောင်တောက်စေမည့် Function
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="w-64 bg-slate-900 text-slate-300 min-h-screen p-4 flex flex-col">
      <div className="mb-8 px-2">
        <h2 className="text-xl font-bold text-white tracking-wide">SMS Billing</h2>
        <p className="text-xs text-slate-500 mt-1">Admin Management Portal</p>
      </div>

      <nav className="flex-1 flex flex-col gap-1.5">
        <Link 
          to="/dashboard" 
          className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
            isActive('/dashboard') ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20' : 'hover:bg-slate-800 hover:text-white'
          }`}
        >
          <span>📊</span> Dashboard
        </Link>

        <Link 
          to="/students" 
          className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
            isActive('/students') ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20' : 'hover:bg-slate-800 hover:text-white'
          }`}
        >
          <span>🧑‍🎓</span> Students
        </Link>

        <Link 
          to="/invoices" 
          className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
            isActive('/invoices') ? 'bg-indigo-600 text-white shadow-md' : 'hover:bg-slate-800 hover:text-white'
          }`}
        >
          <span>🧾</span> Invoices
        </Link>

        <Link 
          to="/payments" 
          className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
            isActive('/payments') ? 'bg-indigo-600 text-white shadow-md' : 'hover:bg-slate-800 hover:text-white'
          }`}
        >
          <span>💳</span> Payments
        </Link>
      </nav>
    </div>
  );
}
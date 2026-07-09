import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import AdminDashboard from './pages/AdminDashboard';
import StudentList from './pages/StudentList';
import InvoiceList from './pages/InvoiceList';
import PaymentList from './pages/PaymentList';

export default function App() {
  return (
    <Router>
      <div className="flex w-full min-h-screen bg-slate-100">
        {/* ပုံသေပြသမည့် Sidebar */}
        <Sidebar />
        
        {/* Router အလိုက် ပြောင်းလဲပေးမည့် စာမျက်နှာများ */}
        <Routes>
          {/* Default Path ရောက်လျှင် dashboard သို့ လွှဲပေးရန် */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          <Route path="/dashboard" element={<AdminDashboard />} />
          <Route path="/students" element={<StudentList />} />
          <Route path="/invoices" element={<InvoiceList />} />  
          <Route path="/payments" element={<PaymentList />} />
        </Routes>
      </div>
    </Router>
  );
}
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import AdminDashboard from './pages/AdminDashboard';
import StudentList from './pages/StudentList';
import InvoiceList from './pages/InvoiceList';
import PaymentList from './pages/PaymentList';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';

function MainLayout() {
  return (
    <div className="flex bg-slate-50 min-h-screen font-sans antialiased">
      <Sidebar />
      <div className="flex-1 overflow-y-auto">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<AdminDashboard />} />
          <Route path="/students" element={<StudentList />} />
          <Route path="/invoices" element={<InvoiceList />} />
          <Route path="/payments" element={<PaymentList />} />
        </Routes>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<Login />} />

        {/* Protected Routes (Login ဝင်ပြီးမှသာ ကြည့်ခွင့်ရှိမည်) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/*" element={<MainLayout />} />
        </Route>
      </Routes>
    </Router>
  );
}
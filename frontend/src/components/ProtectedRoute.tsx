import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute() {
  const token = localStorage.getItem('token');

  // Token မရှိပါက Login စာမျက်နှာသို့ ပြန်မောင်းထုတ်မည်
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Token ရှိပါက ၎င်းအောက်ရှိ သက်ဆိုင်ရာ စာမျက်နှာများကို ပေးပွင့်မည်
  return <Outlet />;
}
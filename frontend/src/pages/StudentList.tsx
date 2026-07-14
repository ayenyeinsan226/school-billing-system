import { useEffect, useState } from 'react';
import axios from 'axios';

interface Student {
  id: number;
  full_name: string;
  phone: string;
  enrollment_date: string;
  status: string;
  course_name: string;
}

export default function StudentList() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal နှင့် Form အတွက် State များ
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [courseId, setCourseId] = useState('3'); // Default: English Diploma
  const [submitLoading, setSubmitLoading] = useState(false);

  const fetchStudents = async () => {
    try {
      const response = await axios.get('/api/students');
      setStudents(response.data);
    } catch (err: any) {
      console.error('Fetch students error:', err);
      setError('Failed to load students list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Form Submit လုပ်ပြီး ကျောင်းသားအသစ်သိမ်းဆည်းခြင်း
  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitLoading(true);

    try {
      await axios.post('/api/students', {
        full_name: fullName,
        phone,
        course_id: parseInt(courseId),
        enrollment_date: new Date().toISOString().split('T')[0],
        status: 'Active'
      });

      // Form များကို Reset ချပြီး Modal ပိတ်ခြင်း
      setFullName('');
      setPhone('');
      setCourseId('1');
      setIsModalOpen(false);
      
      // စာရင်းအသစ်ကို ချက်ချင်း မြင်ရအောင် ဒေတာ ပြန်ဆွဲထုတ်ခြင်း
      fetchStudents();
    } catch (err:any) {
      console.error('Add student error:', err);
      alert(`Failed to add student: ${err.response?.data?.message || err.message}`);
    } finally {
      setSubmitLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto relative">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Students Management</h1>
          <p className="text-slate-500 text-sm mt-0.5">Manage student enrollments and course details</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl shadow-xs transition-all cursor-pointer"
        >
          + Add New Student
        </button>
      </div>

      {/* Table Area */}
      {loading ? (
        <div className="flex items-center justify-center h-64 text-slate-400 font-medium text-sm">
          Loading students data...
        </div>
      ) : error ? (
        <div className="p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl text-sm font-medium">
          ⚠️ {error}
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-xs border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/75 border-b border-slate-100 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Phone Number</th>
                  <th className="px-6 py-4">Course</th>
                  <th className="px-6 py-4">Enrollment Date</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600 text-sm">
                {students.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50/40 transition-colors">
                    <td className="px-6 py-4 text-slate-400 font-medium">#{student.id}</td>
                    <td className="px-6 py-4 font-semibold text-slate-800">{student.full_name}</td>
                    <td className="px-6 py-4 font-mono text-slate-500">{student.phone}</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-medium">
                        {student.course_name}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500">{formatDate(student.enrollment_date)}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        student.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${student.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                        {student.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ✨ Elegant Soft-Overlay Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs transition-opacity">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 border border-slate-100/80 transform transition-all scale-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-800">Enroll New Student</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-xl font-medium cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddStudent} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Student Full Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 bg-slate-50/30"
                  placeholder="e.g. Maung Maung"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Phone Number</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 bg-slate-50/30"
                  placeholder="e.g. 091234567"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Select Course</label>
                <select
                  value={courseId}
                  onChange={(e) => setCourseId(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 bg-slate-50/30"
                >
                  <option value="3">English Diploma</option>
                  <option value="4">IELTS BootCamp</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitLoading}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-xs disabled:opacity-50 cursor-pointer"
                >
                  {submitLoading ? 'Registering...' : 'Register Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
import React, { useState } from 'react';
import { Student } from '../types/billing';

// Mock Data for Initial State
const initialStudents: Student[] = [
  { id: 'STU-001', fullName: 'Su Su', email: 'susu@gmail.com', phone: '091234567', courseName: 'English Diploma', enrollmentDate: '2026-01-10', status: 'Active' },
  { id: 'STU-002', fullName: 'Aung Aung', email: 'aungaung@gmail.com', phone: '097654321', courseName: 'IELTS BootCamp', enrollmentDate: '2026-02-15', status: 'Active' },
];

export default function StudentList() {
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    courseName: 'English Diploma',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newStudent: Student = {
      id: `STU-00${students.length + 1}`,
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      courseName: formData.courseName,
      enrollmentDate: new Date().toISOString().split('T')[0],
      status: 'Active',
    };

    setStudents([newStudent, ...students]);
    setIsDrawerOpen(false); // Form ပိတ်ရန်
    setFormData({ fullName: '', email: '', phone: '', courseName: 'English Diploma' }); // Reset Form
  };

  return (
    <div className="flex-1 p-8 bg-slate-50 min-h-screen relative overflow-hidden">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Students Directory</h1>
          <p className="text-slate-500">Manage school student enrollments and records.</p>
        </div>
        <button 
          onClick={() => setIsDrawerOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-sm transition-all flex items-center gap-2"
        >
          <span>+</span> Add New Student
        </button>
      </header>

      {/* Student Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-400 text-sm font-semibold">
                <th className="p-4">Student ID</th>
                <th className="p-4">Name</th>
                <th className="p-4">Contact</th>
                <th className="p-4">Course</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="text-slate-600 divide-y divide-slate-100">
              {students.map((student) => (
                <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 font-medium text-slate-700">{student.id}</td>
                  <td className="p-4 font-semibold text-indigo-600">{student.fullName}</td>
                  <td className="p-4 text-sm">
                    <div>{student.email}</div>
                    <div className="text-slate-400 text-xs mt-0.5">{student.phone}</div>
                  </td>
                  <td className="p-4 text-slate-700">{student.courseName}</td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {student.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sliding Add Student Form (Drawer Layout) */}
      <div className={`fixed inset-0 bg-black/20 backdrop-blur-xs transition-opacity z-50 ${isDrawerOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
        <div className={`absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl p-6 flex flex-col transform transition-transform duration-300 ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
            <h3 className="text-xl font-bold text-slate-800">Register Student</h3>
            <button onClick={() => setIsDrawerOpen(false)} className="text-slate-400 hover:text-slate-600 text-xl">✕</button>
          </div>

          <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Full Name</label>
              <input type="text" name="fullName" required value={formData.fullName} onChange={handleInputChange} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 text-sm" placeholder="e.g. Mg Mg" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Email Address</label>
              <input type="email" name="email" required value={formData.email} onChange={handleInputChange} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 text-sm" placeholder="e.g. mgmg@gmail.com" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Phone Number</label>
              <input type="text" name="phone" required value={formData.phone} onChange={handleInputChange} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 text-sm" placeholder="e.g. 09xxxxxxxxx" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Enrolling Course</label>
              <select name="courseName" value={formData.courseName} onChange={handleInputChange} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 text-sm bg-white">
                <option value="English Diploma">English Diploma</option>
                <option value="IELTS BootCamp">IELTS BootCamp</option>
                <option value="4-Skills Foundation">4-Skills Foundation</option>
              </select>
            </div>

            <div className="mt-auto pt-4 border-t border-slate-100 flex gap-3">
              <button type="button" onClick={() => setIsDrawerOpen(false)} className="flex-1 py-2 border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50">Cancel</button>
              <button type="submit" className="flex-1 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 shadow-sm">Save Student</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
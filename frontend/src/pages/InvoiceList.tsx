import React, { useState } from 'react';
import { Invoice } from '../types/billing';

const initialInvoices: Invoice[] = [
  { id: 'INV-1001', studentName: 'Su Su', courseName: 'English Diploma', amountDue: 150, amountPaid: 150, dueDate: '2026-07-15', status: 'Paid' },
  { id: 'INV-1002', studentName: 'Aung Aung', courseName: 'IELTS BootCamp', amountDue: 200, amountPaid: 0, dueDate: '2026-07-20', status: 'Unpaid' },
];

export default function InvoiceList() {
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ studentName: '', courseName: 'English Diploma', amountDue: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newInvoice: Invoice = {
      id: `INV-${1000 + invoices.length + 1}`,
      studentName: formData.studentName,
      courseName: formData.courseName,
      amountDue: Number(formData.amountDue),
      amountPaid: 0,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // ယနေ့မှ နောက်ထပ် ၇ ရက် ပေးရန်
      status: 'Unpaid',
    };
    setInvoices([newInvoice, ...invoices]);
    setIsModalOpen(false);
    setFormData({ studentName: '', courseName: 'English Diploma', amountDue: '' });
  };

  return (
    <div className="flex-1 p-8 bg-slate-50 min-h-screen">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Invoices Billing</h1>
          <p className="text-slate-500">Issue student tuition fees and track outstanding balances.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-sm transition-all">+ Create Invoice</button>
      </header>

      {/* Invoice Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-400 text-sm font-semibold">
              <th className="p-4">Invoice ID</th>
              <th className="p-4">Student Name</th>
              <th className="p-4">Course</th>
              <th className="p-4">Amount Due</th>
              <th className="p-4">Due Date</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="text-slate-600 divide-y divide-slate-100">
            {invoices.map((inv) => (
              <tr key={inv.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="p-4 font-semibold text-indigo-600">{inv.id}</td>
                <td className="p-4 font-medium text-slate-700">{inv.studentName}</td>
                <td className="p-4 text-sm">{inv.courseName}</td>
                <td className="p-4 font-semibold">${inv.amountDue}</td>
                <td className="p-4 text-sm text-slate-400">{inv.dueDate}</td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                    inv.status === 'Paid' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>{inv.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pop-up Create Invoice Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-xs flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-bold text-slate-800 mb-4">Generate New Invoice</h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Select Student</label>
                <input type="text" required value={formData.studentName} onChange={(e) => setFormData({...formData, studentName: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" placeholder="Student Name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Course</label>
                <select value={formData.courseName} onChange={(e) => setFormData({...formData, courseName: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white">
                  <option value="English Diploma">English Diploma</option>
                  <option value="IELTS BootCamp">IELTS BootCamp</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Fee Amount ($)</label>
                <input type="number" required value={formData.amountDue} onChange={(e) => setFormData({...formData, amountDue: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" placeholder="150" />
              </div>
              <div className="flex gap-3 mt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2 border border-slate-200 rounded-lg text-sm font-medium">Cancel</button>
                <button type="submit" className="flex-1 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">Issue Invoice</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
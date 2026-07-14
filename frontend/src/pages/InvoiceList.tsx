import { useEffect, useState } from 'react';
import axios from 'axios';

interface Invoice {
  id: number;
  invoice_number: string;
  student_name: string;
  amount: number;
  due_date: string;
  status: string;
}

interface Student {
  id: number;
  full_name: string;
}

export default function InvoiceList() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal နှင့် Form States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);

  const fetchInvoices = async () => {
    try {
      const response = await axios.get('/api/invoices');
      setInvoices(response.data);
    } catch (err) {
      console.error('Fetch invoices error:', err);
      setError('Failed to load invoices.');
    } finally {
      setLoading(false);
    }
  };

  // Dropdown တွင် ပြသရန် ကျောင်းသားစာရင်းကိုပါ ဆွဲထုတ်ခြင်း
  const fetchStudents = async () => {
    try {
      const response = await axios.get('/api/students');
      setStudents(response.data);
      if (response.data.length > 0) {
        setSelectedStudentId(response.data[0].id.toString()); // ပထမဆုံးကျောင်းသားကို Default ရွေးထားမည်
      }
    } catch (err) {
      console.error('Fetch students error:', err);
    }
  };

  useEffect(() => {
    fetchInvoices();
    fetchStudents();
  }, []);

  // Invoice အသစ်ထုတ်ခြင်း တင်သွင်းမှု Logic
  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId || !amount || !dueDate) return;

    setSubmitLoading(true);
    try {
      await axios.post('/api/invoices', {
        student_id: parseInt(selectedStudentId),
        amount: parseFloat(amount),
        due_date: dueDate
      });

      // Form ပိတ်ပြီး ဒေတာ ပြန်ဆွဲထုတ်ခြင်း
      setAmount('');
      setDueDate('');
      setIsModalOpen(false);
      fetchInvoices();
    } catch (err) {
      console.error('Create invoice error:', err);
      alert('Failed to create invoice. Please try again.');
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
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Invoices Management</h1>
          <p className="text-slate-500 text-sm mt-0.5">Track and manage student fee invoices</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl shadow-xs transition-all cursor-pointer"
        >
          + Create Invoice
        </button>
      </div>

      {/* Table Area */}
      {loading ? (
        <div className="flex items-center justify-center h-64 text-slate-400 font-medium text-sm">
          Loading invoices...
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
                  <th className="px-6 py-4">Invoice No</th>
                  <th className="px-6 py-4">Student Name</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Due Date</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600 text-sm">
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-slate-50/40 transition-colors">
                    <td className="px-6 py-4 font-mono font-semibold text-indigo-600">{invoice.invoice_number}</td>
                    <td className="px-6 py-4 font-semibold text-slate-800">{invoice.student_name}</td>
                    <td className="px-6 py-4 font-mono text-slate-700 font-medium">
                      {Number(invoice.amount).toLocaleString()} MMK
                    </td>
                    <td className="px-6 py-4 text-slate-500">{formatDate(invoice.due_date)}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        invoice.status === 'Paid' 
                          ? 'bg-emerald-50 text-emerald-700' 
                          : 'bg-amber-50 text-amber-700'
                      }`}>
                        {invoice.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ✨ Create Invoice Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 border border-slate-100/80">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-800">Create New Invoice</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-xl font-medium cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateInvoice} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Select Student</label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 bg-slate-50/30"
                >
                  {students.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.full_name} (#{student.id})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Fee Amount (MMK)</label>
                <input
                  type="number"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 bg-slate-50/30"
                  placeholder="e.g. 150000"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Due Date</label>
                <input
                  type="date"
                  required
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 bg-slate-50/30"
                />
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
                  {submitLoading ? 'Creating...' : 'Create Invoice'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
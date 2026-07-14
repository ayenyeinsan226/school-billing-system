import { useEffect, useState } from 'react';
import axios from 'axios';

interface Payment {
  id: number;
  invoice_number: string;
  student_name: string;
  amount: number;
  payment_date: string;
  payment_method: string;
}

interface Invoice {
  id: number;
  invoice_number: string;
  student_name: string;
  amount: number;
  status: string;
}

export default function PaymentList() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [unpaidInvoices, setUnpaidInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal and Form States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState('');
  const [amountPaid, setAmountPaid] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [submitLoading, setSubmitLoading] = useState(false);

  const fetchPayments = async () => {
    try {
      const response = await axios.get('/api/payments');
      setPayments(response.data);
    } catch (err) {
      console.error('Fetch payments error:', err);
      setError('Failed to load payment records.');
    } finally {
      setLoading(false);
    }
  };

  // ငွေသွင်းရန်အတွက် Unpaid ဖြစ်နေသော Invoices စာရင်းကို သီးသန့်ဆွဲထုတ်ခြင်း
  const fetchUnpaidInvoices = async () => {
    try {
      const response = await axios.get('/api/invoices');
      const unpaid = response.data.filter((inv: Invoice) => inv.status === 'Unpaid');
      setUnpaidInvoices(unpaid);
      if (unpaid.length > 0) {
        setSelectedInvoiceId(unpaid[0].id.toString());
        setAmountPaid(unpaid[0].amount.toString()); // Default amount ကို သက်ဆိုင်ရာ Invoice တန်ဖိုးအတိုင်း ဖြည့်ပေးထားမည်
      }
    } catch (err) {
      console.error('Fetch unpaid invoices error:', err);
    }
  };

  useEffect(() => {
    fetchPayments();
    fetchUnpaidInvoices();
  }, []);

  // Invoice ရွေးချယ်မှု ပြောင်းသွားပါက သက်ဆိုင်ရာ ပေးသွင်းရမည့် Amount ကို Auto-fill ဖြစ်စေရန်
  const handleInvoiceChange = (idStr: string) => {
    setSelectedInvoiceId(idStr);
    const selectedInv = unpaidInvoices.find(inv => inv.id.toString() === idStr);
    if (selectedInv) {
      setAmountPaid(selectedInv.amount.toString());
    }
  };

  const handleCreatePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvoiceId || !amountPaid) return;

    setSubmitLoading(true);
    try {
      await axios.post('/api/payments', {
        invoice_id: parseInt(selectedInvoiceId),
        amount_paid: parseFloat(amountPaid),
        payment_method: paymentMethod
      });

      // Reset & Refresh Data
      setIsModalOpen(false);
      fetchPayments();
      fetchUnpaidInvoices();
    } catch (err) {
      console.error('Record payment error:', err);
      alert('Failed to record payment. Please try again.');
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
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Payments Records</h1>
          <p className="text-slate-500 text-sm mt-0.5">Track paid tuition fees and payment methods</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          disabled={unpaidInvoices.length === 0}
          className="inline-flex items-center justify-center px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-semibold text-sm rounded-xl shadow-xs transition-all cursor-pointer"
        >
          {unpaidInvoices.length === 0 ? 'No Unpaid Invoices' : '+ Record Payment'}
        </button>
      </div>

      {/* Table Area */}
      {loading ? (
        <div className="flex items-center justify-center h-64 text-slate-400 font-medium text-sm">
          Loading payments...
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
                  <th className="px-6 py-4">Receipt ID</th>
                  <th className="px-6 py-4">Invoice No</th>
                  <th className="px-6 py-4">Student Name</th>
                  <th className="px-6 py-4">Amount Paid</th>
                  <th className="px-6 py-4">Payment Date</th>
                  <th className="px-6 py-4">Method</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600 text-sm">
                {payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-slate-50/40 transition-colors">
                    <td className="px-6 py-4 text-slate-400 font-medium">#REC-{payment.id}</td>
                    <td className="px-6 py-4 font-mono font-semibold text-indigo-600">{payment.invoice_number}</td>
                    <td className="px-6 py-4 font-semibold text-slate-800">{payment.student_name}</td>
                    <td className="px-6 py-4 font-mono text-emerald-600 font-semibold">
                      + {Number(payment.amount).toLocaleString()} MMK
                    </td>
                    <td className="px-6 py-4 text-slate-500">{formatDate(payment.payment_date)}</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold">
                        {payment.payment_method}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {payments.length === 0 && (
            <div className="text-center py-12 text-slate-400 text-sm">
              No payments recorded yet.
            </div>
          )}
        </div>
      )}

      {/* ✨ Record Payment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 border border-slate-100/80">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-800">Record Fee Payment</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-xl font-medium cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePayment} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Select Unpaid Invoice</label>
                <select
                  value={selectedInvoiceId}
                  onChange={(e) => handleInvoiceChange(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 bg-slate-50/30"
                >
                  {unpaidInvoices.map((inv) => (
                    <option key={inv.id} value={inv.id}>
                      INV-2026-{inv.id} ({inv.student_name} - {Number(inv.amount).toLocaleString()} MMK)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Amount to Pay (MMK)</label>
                <input
                  type="number"
                  required
                  value={amountPaid}
                  onChange={(e) => setAmountPaid(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 bg-slate-50/30"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 bg-slate-50/30"
                >
                  <option value="Cash">Cash</option>
                  <option value="Mobile Banking">KBZPay / CBPay / WavePay</option>
                  <option value="Bank Transfer">AYA / KBZ Bank Transfer</option>
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
                  {submitLoading ? 'Recording...' : 'Complete Payment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
import React, { useState } from 'react';
import { PaymentRecord } from '../types/billing';

const initialPayments: PaymentRecord[] = [
  { id: 'PAY-5001', invoiceId: 'INV-1001', studentName: 'Su Su', amountPaid: 150, paymentMethod: 'KPay', paymentDate: '2026-07-09' },
];

export default function PaymentList() {
  const [payments] = useState<PaymentRecord[]>(initialPayments);

  return (
    <div className="flex-1 p-8 bg-slate-50 min-h-screen">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Payment History</h1>
        <p className="text-slate-500">View and audit all financial collections from students.</p>
      </header>

      {/* Payment Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-400 text-sm font-semibold">
              <th className="p-4">Payment ID</th>
              <th className="p-4">Invoice ID</th>
              <th className="p-4">Student Name</th>
              <th className="p-4">Amount Paid</th>
              <th className="p-4">Method</th>
              <th className="p-4">Date</th>
            </tr>
          </thead>
          <tbody className="text-slate-600 divide-y divide-slate-100">
            {payments.map((pay) => (
              <tr key={pay.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="p-4 font-semibold text-emerald-600">{pay.id}</td>
                <td className="p-4 font-medium text-slate-500">{pay.invoiceId}</td>
                <td className="p-4 font-semibold text-slate-700">{pay.studentName}</td>
                <td className="p-4 font-bold text-emerald-700">${pay.amountPaid}</td>
                <td className="p-4">
                  <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                    {pay.paymentMethod}
                  </span>
                </td>
                <td className="p-4 text-sm text-slate-400">{pay.paymentDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
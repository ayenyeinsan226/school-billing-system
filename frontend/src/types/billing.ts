export interface DashboardStats {
  totalStudents: number;
  monthlyRevenue: number;
  pendingInvoicesCount: number;
}

export interface InvoiceListItem {
  id: string;
  studentName: string;
  amount: number;
  status: 'Paid' | 'Pending' | 'Overdue';
  dueDate?: string;
}

export interface Student {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  courseName: string;
  enrollmentDate: string;
  status: 'Active' | 'Completed' | 'Dropped';
}

export interface Invoice {
  id: string;
  studentName: string;
  courseName: string;
  amountDue: number;
  amountPaid: number;
  dueDate: string;
  status: 'Paid' | 'Partially_Paid' | 'Unpaid';
}

export interface PaymentRecord {
  id: string;
  invoiceId: string;
  studentName: string;
  amountPaid: number;
  paymentMethod: 'Cash' | 'KPay' | 'WaveMoney' | 'Bank_Transfer';
  paymentDate: string;
}
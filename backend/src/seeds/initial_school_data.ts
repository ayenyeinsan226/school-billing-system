import { Knex } from 'knex';
import bcrypt from 'bcrypt';

export async function seed(knex: Knex): Promise<void> {
  // ၁။ အရင်ဆုံး ရှိပြီးသား ဒေတာအဟောင်းများကို အစဉ်လိုက်အတိုင်း ရှင်းလင်းပါ (Truncate)
  await knex('payments').del();
  await knex('invoices').del();
  await knex('students').del();
  await knex('courses').del();
  await knex('users').del();

  const hashedPassword = bcrypt.hashSync('password123', 10);

  // ၂။ Users Data သွင်းခြင်း (Admin နှင့် ကျောင်းသားများ)
  // လက်တွေ့မှာ password ကို hash လုပ်ရမှာဖြစ်ပေမဲ့ လောလောဆယ် စမ်းသပ်ရန် plain text ဖြင့် ထားပါမည်
  const users = await knex('users').insert([
    { email: 'admin@school.com', password: hashedPassword, role: 'admin' },
    { email: 'susu@gmail.com', password: hashedPassword, role: 'student' },
    { email: 'aungaung@gmail.com', password: hashedPassword, role: 'student' }
  ]).returning(['id', 'email']);

  const adminUser = users.find(u => u.email === 'admin@school.com');
  const susuUser = users.find(u => u.email === 'susu@gmail.com');
  const aungUser = users.find(u => u.email === 'aungaung@gmail.com');

  // ၃။ Courses Data သွင်းခြင်း
  const courses = await knex('courses').insert([
    { course_name: 'English Diploma', description: 'Comprehensive 1-year diploma course', fee_amount: 150.00, duration_months: 12 },
    { course_name: 'IELTS BootCamp', description: 'Intensive 3-month exam preparation', fee_amount: 200.00, duration_months: 3 }
  ]).returning(['id', 'course_name']);

  const engDiploma = courses.find(c => c.course_name === 'English Diploma');
  const ieltsBoot = courses.find(c => c.course_name === 'IELTS BootCamp');

  // ၄။ Students Data သွင်းခြင်း
  const students = await knex('students').insert([
    { user_id: susuUser?.id, full_name: 'Su Su', phone: '091234567', course_id: engDiploma?.id, enrollment_date: '2026-01-10', status: 'Active' },
    { user_id: aungUser?.id, full_name: 'Aung Aung', phone: '097654321', course_id: ieltsBoot?.id, enrollment_date: '2026-02-15', status: 'Active' }
  ]).returning(['id', 'full_name']);

  const susuStudent = students.find(s => s.full_name === 'Su Su');
  const aungStudent = students.find(s => s.full_name === 'Aung Aung');

  // ၅။ Invoices Data သွင်းခြင်း
  const invoices = await knex('invoices').insert([
    { student_id: susuStudent?.id, amount_due: 150.00, amount_paid: 150.00, due_date: '2026-07-15', status: 'Paid' },
    { student_id: aungStudent?.id, amount_due: 200.00, amount_paid: 0.00, due_date: '2026-07-20', status: 'Unpaid' }
  ]).returning(['id', 'student_id']);

  const susuInvoice = invoices.find(i => i.student_id === susuStudent?.id);

  // ၆။ Payments Data သွင်းခြင်း (Su Su က ငွေအကြေသွင်းထားသည့် မှတ်တမ်း)
  await knex('payments').insert([
    { invoice_id: susuInvoice?.id, amount: 150.00, payment_method: 'KPay' }
  ]);
}
import { Request, Response } from 'express';
import db from '../db';

// ၁။ Payment သမိုင်းကြောင်းအားလုံးကို ဆွဲထုတ်ခြင်း
export const getAllPayments = async (req: Request, res: Response): Promise<void> => {
  try {
    const payments = await db('payments')
      .join('invoices', 'payments.invoice_id', '=', 'invoices.id')
      .join('students', 'invoices.student_id', '=', 'students.id')
      .select(
        'payments.id',
        db.raw("concat('INV-2026-', invoices.id) as invoice_number"),
        'students.full_name as student_name',
        'payments.amount as amount',
        'payments.payment_date',
        'payments.payment_method'
      )
      .orderBy('payments.id', 'desc');

    res.status(200).json(payments);
  } catch (error) {
    console.error('Get payments error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// ၂။ ငွေပေးချေမှုအသစ် လက်ခံသိမ်းဆည်းခြင်း (နဂို Invoice Status ကိုပါ Auto-update ဖြစ်စေရန်)

export const createPayment = async (req: Request, res: Response): Promise<void> => {
  const trx = await db.transaction();

  try {
    const { invoice_id, amount_paid, payment_method } = req.body;

    if (!invoice_id || !amount_paid || !payment_method) {
      res.status(400).json({ message: 'Missing required fields' });
      return;
    }

    // ✨ ပြင်ဆင်လိုက်သည့်နေရာ: database ထဲရှိ column အမည် 'amount' နေရာတွင် amount_paid တန်ဖိုးကို ထည့်သွင်းခြင်း
    const [newPayment] = await trx('payments').insert({
      invoice_id,
      amount: parseFloat(amount_paid), // <-- ဒီနေရာကို 'amount_paid' အစား 'amount' ဟု ပြောင်းလဲပါ
      payment_date: new Date().toISOString().split('T')[0],
      payment_method
    }).returning('*');

    // (ခ) သက်ဆိုင်ရာ Invoices Table ရှိ status ကို 'Paid' ဟု ပြောင်းလဲခြင်းနှင့် amount_paid ကို သွားပေါင်းပေးခြင်း
    await trx('invoices')
      .where({ id: invoice_id })
      .update({
        status: 'Paid',
        amount_paid: db.raw('amount_paid + ?', [amount_paid])
      });

    await trx.commit();

    res.status(201).json({
      message: 'Payment recorded and Invoice updated successfully',
      payment: newPayment
    });
  } catch (error) {
    await trx.rollback();
    console.error('Create payment error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
import { Request, Response } from 'express';
import db from '../db';

// ၁။ Invoice အားလုံးကို ဒေတာဘေ့စ် Column နာမည်အမှန်များဖြင့် ဆွဲထုတ်ခြင်း
export const getAllInvoices = async (req: Request, res: Response): Promise<void> => {
  try {
    const invoices = await db('invoices')
      .join('students', 'invoices.student_id', '=', 'students.id')
      .select(
        'invoices.id',
        // 💡 ဒေတာဘေ့စ်ထဲတွင် invoice_no မရှိ၍ id ကိုပဲ Invoice Number အဖြစ် Frontend အတွက် alias ပေးလိုက်ခြင်း
        db.raw("concat('INV-2026-', invoices.id) as invoice_number"),
        'students.full_name as student_name',
        'invoices.amount_due as amount', // amount_due ကို amount အဖြစ် alias ပေးခြင်း
        'invoices.due_date',
        'invoices.status'
      )
      .orderBy('invoices.id', 'desc');

    res.status(200).json(invoices);
  } catch (error) {
    console.error('Get invoices error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// ၂။ Invoice အသစ် ဖန်တီးခြင်း
export const createInvoice = async (req: Request, res: Response): Promise<void> => {
  try {
    const { student_id, amount, due_date } = req.body;

    if (!student_id || !amount || !due_date) {
      res.status(400).json({ message: 'Missing required fields' });
      return;
    }

    const [newInvoice] = await db('invoices').insert({
      student_id,
      amount_due: amount, // ဒေတာဘေ့စ် Column နာမည်အမှန်သို့ ပို့ပေးခြင်း
      amount_paid: 0,     // Default value
      due_date,
      status: 'Unpaid'
    }).returning('*');

    res.status(201).json({
      message: 'Invoice created successfully',
      invoice: newInvoice
    });
  } catch (error) {
    console.error('Create invoice error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
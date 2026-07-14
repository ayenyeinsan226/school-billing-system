import { Request, Response } from 'express';
import db from '../db';

// ၁။ ကျောင်းသားအားလုံးကို ဆွဲထုတ်ခြင်း (Get All Students)
export const getAllStudents = async (req: Request, res: Response): Promise<void> => {
  try {
    const students = await db('students')
      .join('courses', 'students.course_id', '=', 'courses.id')
      .select(
        'students.id',
        'students.full_name',
        'students.phone',
        'students.enrollment_date',
        'students.status',
        'courses.course_name'
      )
      .orderBy('students.id', 'desc');

    res.status(200).json(students);
  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// ၂။ ကျောင်းသားအသစ် ထည့်သွင်းခြင်း (Create Student)
export const createStudent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { full_name, phone, course_id, enrollment_date, status } = req.body;

    // အချက်အလက် ပြည့်စုံမှု ရှိ၊ မရှိ စစ်ဆေးခြင်း
    if (!full_name || !phone || !course_id) {
      res.status(400).json({ message: 'Missing required fields' });
      return;
    }

    // Students Table ထဲသို့ အသစ်ထည့်ခြင်း
    const [newStudent] = await db('students').insert({
      full_name,
      phone,
      course_id,
      enrollment_date: enrollment_date || new Date().toISOString().split('T')[0],
      status: status || 'Active'
    }).returning('*');

    res.status(201).json({
      message: 'Student enrolled successfully',
      student: newStudent
    });
  } catch (error) {
    console.error('Create student error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
import { Router } from 'express';
import { getAllStudents, createStudent } from '../controllers/studentController';

const router = Router();

// GET /api/students - ကျောင်းသားစာရင်းအားလုံး ယူရန်
router.get('/', getAllStudents);

// POST /api/students - ကျောင်းသားအသစ် ထည့်ရန်
router.post('/', createStudent);

export default router;
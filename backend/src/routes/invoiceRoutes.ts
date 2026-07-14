import { Router } from 'express';
import { getAllInvoices, createInvoice } from '../controllers/invoiceController';

const router = Router();

router.get('/', getAllInvoices);
router.post('/', createInvoice);

export default router;
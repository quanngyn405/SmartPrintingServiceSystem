import express from 'express';
import TransactionController from '../controllers/TransactionController.js';

const router = express.Router();

// Transaction routes
router.post('/transactions/purchase', TransactionController.createTransaction);
router.get('/transactions/:student_id', TransactionController.getAllTransactionByStudentId); 

export default router;
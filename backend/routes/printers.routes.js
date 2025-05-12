// routes/printer.routes.js

import express from 'express';
import PrinterController from '../controllers/PrinterController.js';
import PrintConfigController from '../controllers/PrintConfigController.js';

const router = express.Router();

// Printer routes
router.get('/printers', PrinterController.getAllPrinters); // Đã check 
router.get('/printers/:printer_id', PrinterController.getPrinterByID); // Đã check
router.patch('/printers/:printer_id', PrinterController.updatePrinterStatus); // Đã check
router.post('/printers', PrinterController.createPrinter);

// Print Config routes
router.get('/print-config/default', PrintConfigController.getDefaultConfig);

export default router;
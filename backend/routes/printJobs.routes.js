import express from 'express';
import PrintJobController from '../controllers/PrintJobController.js';


const router1 = express.Router();


router1.post('/print-jobs', PrintJobController.createPrintJob); // done
router1.get('/print-jobs/:student_id', PrintJobController.getStudentPrintJobs); // done 
router1.get('/print-jobs', PrintJobController.getAllPrintJobs); // done 
router1.get('/print-jobs/:print_jobs_id/files', PrintJobController.getJobFiles);  // done 
export default router1;

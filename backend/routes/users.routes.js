import express from 'express';
import UserController from '../controllers/UserController.js';

const router = express.Router();

// User routes
router.get('/users/idid/:user_id', UserController.getUsersByID);  
router.get('/users/namename/:username', UserController.getUsersByUsername);  

router.get('/users/student/:username', UserController.getStudentByUsername);
export default router;
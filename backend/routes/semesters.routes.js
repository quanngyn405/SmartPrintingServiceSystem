// routes/semesterRoutes.js

import express from 'express';
import SemesterController from '../controllers/SemesterController.js';

const router = express.Router();

/**
 * Route to get all semesters.
 * Accessible only by SPSO role.
 * @route GET /semesters
 * @returns {Object} JSON response with all semesters.
 */
router.get(
    '/semesters',
    SemesterController.getAllSemesters
);

/**
 * Route to get a semester by its allocation ID.
 * Accessible by STUDENT and SPSO roles.
 * @route GET /semesters/:allocation_id
 * @param {string} allocation_id - ID of the semester to retrieve.
 * @returns {Object} JSON response with the semester data or an error message.
 */
router.get(
    '/semesters/:allocation_id',
    SemesterController.getSemesterById
);

/**
 * Route to update the page allocation for a specific semester.
 * Accessible only by SPSO role.
 * @route PATCH /semesters/:allocation_id
 * @param {string} allocation_id - ID of the semester to update.
 * @body {number} page_allocated - New page allocation value.
 * @returns {Object} JSON response indicating success or failure of the operation.
 */
router.patch(
    '/semesters/:allocation_id',
    SemesterController.updatePageAllocation
);

/**
 * Route to create a new semester.
 * Accessible only by SPSO role.
 * @route POST /semesters
 * @body {string} semester_name - Name of the semester.
 * @body {string} start_date - Start date of the semester (ISO format).
 * @body {string} end_date - End date of the semester (ISO format).
 * @body {number} page_allocated - Number of pages allocated to the semester.
 * @returns {Object} JSON response with the created semester data or an error message.
 */
router.post(
    '/semesters',
    SemesterController.createSemester
);

export default router;
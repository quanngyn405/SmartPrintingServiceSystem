// controllers/SemesterController.js
import SemesterRepository from "../repositories/SemesterRepository.js";
/**
 * Controller for managing semester-related operations.
 */
class SemesterController {
    constructor() {
        this.semesterRepository = new SemesterRepository();
    }

    /**
     * Get all semesters.
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     * @returns {Promise<Object>} JSON response containing all semesters.
     */
    getAllSemesters = async (req, res) => {
        try {
            const semesters = await this.semesterRepository.getAllSemesters();
            return res.status(200).json({
                success: true,
                data: semesters
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    /**
     * Get a semester by its ID.
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     * @returns {Promise<Object>} JSON response containing the semester or an error message.
     */
    getSemesterById = async (req, res) =>  {
        try {
            const { allocation_id } = req.params;
            const semester = await this.semesterRepository.getSemesterById(allocation_id);

            if (!semester) {
                return res.status(404).json({
                    success: false,
                    message: 'Semester not found'
                });
            }

            return res.status(200).json({
                success: true,
                data: semester
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    /**
     * Update the page allocation for a specific semester.
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     * @returns {Promise<Object>} JSON response indicating success or failure.
     */
    updatePageAllocation = async (req, res) => {
        try {
            const { allocation_id } = req.params;
            const { page_allocated } = req.body;

            if (!page_allocated || page_allocated < 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid page allocation value'
                });
            }

            const success = await this.semesterRepository.updatePageAllocation(
                allocation_id,
                page_allocated
            );

            if (!success) {
                return res.status(400).json({
                    success: false,
                    message: 'Cannot update past semester or semester not found'
                });
            }

            return res.status(200).json({
                success: true,
                message: 'Page allocation updated successfully'
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    /**
     * Create a new semester.
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     * @returns {Promise<Object>} JSON response containing the newly created semester or an error message.
     */
    createSemester = async (req, res) =>  {
        try {
            const { semester_name, start_date, end_date, page_allocated } = req.body;

            if (!semester_name || !start_date || !end_date || !page_allocated) {
                return res.status(400).json({
                    success: false,
                    message: 'Missing required fields'
                });
            }

        
            if (new Date(end_date) <= new Date(start_date)) {
                return res.status(400).json({
                    success: false,
                    message: 'End date must be after start date'
                });
            }

            await this.semesterRepository.createSemester({
                semester_name,
                start_date,
                end_date,
                page_allocated
            });

            return res.status(200).json({
                success: true,
                message: 'Semester created successfully'
            });
        } catch (error) {
            console.error(error);
            if (error.message === 'Semester start date must be in the future') {
                return res.status(400).json({
                    success: false,
                    message: error.message
                });
            }
            return res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
}

export default new SemesterController();
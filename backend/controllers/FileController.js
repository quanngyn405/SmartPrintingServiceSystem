import FileRepository from "../repositories/FileRepository.js";
import fs from 'fs-extra';
import path from 'path';
import dotenv from 'dotenv';
import { moveFileToFinalDestination } from "../config/uploadConfig.js";
dotenv.config();

/**
 * Helper function to get file size in bytes.
 * @param {string} filePath - Full path to the file.
 * @returns {number} - Size of the file in bytes.
 */
function getFileSizeInBytes(filePath) {
    const stats = fs.statSync(filePath);
    return stats.size;
}

/**
 * Controller handling File-related operations.
 * This controller defines methods to upload, fetch, serve, and delete files.
 */
class FileController {
    constructor() {
        this.fileRepository = new FileRepository();
    }

    /**
     * Get all files associated with a specific student ID.
     * 
     * **Request Structure**:
     * - Method: GET
     * - URL: `/files/student/:student_id`
     * 
     * **Request Parameters**:
     * - `student_id` (Path Parameter): The ID of the student whose files are being fetched.
     * 
     * **Response**:
     * - Status 200: A list of files belonging to the student.
     * - Status 404: If no files are found for the given student ID.
     * - Status 500: On server error.
     */
    getAllFilesByStudentId = async (req, res) => {
        try {
            const studentId = parseInt(req.params.student_id);
            const files = await this.fileRepository.findByStudentId(studentId);
            
            

            const filesWithFullPath = files.map(file => ({
                ...file,
                file_path: `http://localhost:5000/uploads/${file.file_path.replace(/\\/g, '/')}`
                // file_path : path.join(process.env.UPLOAD_BASE_PATH, file.file_path.replace(/\\/g, '/'))
            }));
            console.log('Files for student ID', studentId, ': ', filesWithFullPath);
                

            res.status(200).json({
                success: true,
                files: filesWithFullPath
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: `Failed to fetch files: ${error.message}`
            });
        }
    };

    /**
     * Upload a file and save its metadata to the database.
     * 
     * **Request Structure**:
     * - Method: POST
     * - URL: `/files/upload`
     * - Body Parameters:
     *   - `student_id` (integer): The ID of the student uploading the file.
     *   - `file_type_id` (integer): The type/category of the file.
     *   - File: Multipart form-data for the file being uploaded.
     * 
     * **Response**:
     * - Status 200: File upload successful, returns file metadata.
     * - Status 400: If no file is provided in the request.
     * - Status 500: On server error or database failure.
     */


    uploadFile = async (req, res) => {
        try {
            console.log('Request body in uploadfile:', req.body);
            console.log('File in uploadfile:', req.file);
            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: "No file uploaded"
                });
            }
            const {
                student_id,
                file_type_id
            } = req.body;
            const fileSize = req.file.size;
            
            if (!student_id || !file_type_id) {
                await fs.unlink(req.file.path);
                return res.status(400).json({
                    success: false,
                    message: "Missing student_id or file_type_id"
                });
            }

            
            const { relativePath, numberOfPages } = await moveFileToFinalDestination(
                req.file.path,
                student_id,
                file_type_id
            );
            
            console.log("Relative Path: ", relativePath);
            

            const newFile = await this.fileRepository.create({
                student_id: parseInt(student_id),
                file_type_id: parseInt(file_type_id),
                file_path: relativePath,
                filename: req.file.originalname,
                upload_at: new Date(),
                number_of_pages: numberOfPages,
                size: fileSize
            });

            res.status(200).json({
                success: true,
                message: "File created successfully",
                file: newFile
            });
        } catch (error) {
            if (req.file) {
                await fs.remove(req.file.path); 
            }
            res.status(500).json({
                success: false,
                message: `Failed to create file: ${error.message}`
            });
        }
    };

    /**
     * Delete all files for a specific student ID.
     * 
     * **Request Structure**:
     * - Method: DELETE
     * - URL: `/files/student/:student_id`
     * 
     * **Request Parameters**:
     * - `student_id` (Path Parameter): The ID of the student whose files are being deleted.
     * 
     * **Response**:
     * - Status 200: Files deleted successfully.
     * - Status 404: If no files are found for the given student ID.
     * - Status 500: On server error.
     */
    deleteFileByStudentId = async (req, res) => {
        try {
            const studentId = parseInt(req.params.student_id);
            const file = await this.fileRepository.deleteByStudentId(studentId);
            if (!file) {
                return res.status(404).json({
                    success: false,
                    message: "File not found"
                });
            }
            res.status(200).json({
                success: true,
                message: "Files deleted successfully"
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: `Failed to delete files: ${error.message}`
            });
        }
    };

    /**
     * Delete a file by its unique file ID.
     * 
     * **Request Structure**:
     * - Method: DELETE
     * - URL: `/files/:file_id`
     * 
     * **Request Parameters**:
     * - `file_id` (Path Parameter): The unique ID of the file to be deleted.
     * 
     * **Response**:
     * - Status 200: File deleted successfully.
     * - Status 404: If the file is not found.
     * - Status 500: On server error.
     */
    deleteFileByFileId = async (req, res) => {
        try {
            const fileId = parseInt(req.params.file_id);
            const file = await this.fileRepository.findById(fileId);

            if (!file) {
                return res.status(404).json({
                    success: false,
                    message: "File not found"
                });
            }
            const fullPath = path.join(
                process.env.UPLOAD_BASE_PATH,
                file.file_path
            );

            await fs.remove(fullPath); // Remove file from storage
            await this.fileRepository.deleteByFileId(fileId); // Remove file metadata
            res.status(200).json({
                success: true,
                message: "File deleted successfully"
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: `Failed to delete file: ${error.message}`
            });
        }
    };

    /**
     * Serve a file for download.
     * 
     * **Request Structure**:
     * - Method: GET
     * - URL: `/files/download/:file_id`
     * 
     * **Request Parameters**:
     * - `file_id` (Path Parameter): The unique ID of the file to be downloaded.
     * 
     * **Response**:
     * - Status 200: Triggers file download.
     * - Status 404: If the file is not found.
     * - Status 500: On server error.
     */
    serveFile = async (req, res) => {
        try {
            const fileId = parseInt(req.params.file_id);
            const file = await this.fileRepository.findById(fileId);

            if (!file) {
                return res.status(404).json({
                    success: false,
                    message: "File not found"
                });
            }
            const fullPath = path.join(process.env.UPLOAD_BASE_PATH, file.file_path);
            res.download(fullPath, file.filename); // Serve the file for download
        } catch (error) {
            res.status(500).json({
                success: false,
                message: `Failed to serve file: ${error.message}`
            });
        }
    };
};

export default new FileController();

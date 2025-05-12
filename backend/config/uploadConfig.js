/**
 * @file uploadConfig.js
 * @description Configuration file for handling file uploads using Multer.
 * This module sets up the file storage strategy, including the directory structure and file naming conventions.
 * It dynamically creates directories based on student ID and file type ID and enforces upload limits.
 */



import multer from 'multer';
import path from 'path';
import fs from 'fs-extra';
import dotenv from 'dotenv';
import { PDFDocument } from 'pdf-lib';


export const getPageCount = async (filePath) => {
    const pdfBuffer = await fs.readFile(filePath);
    const pdfDoc = await PDFDocument.load(pdfBuffer);
    return pdfDoc.getPageCount();
};


dotenv.config();



/**
 * Multer storage configuration.
 * - Dynamically constructs the upload path based on student ID and file type ID.
 * - Ensures directories are created if they do not exist.
 */

const storage = multer.diskStorage({
   
    destination: async function (req, file, cb) {
        try {
            const tempPath = path.join(process.env.UPLOAD_BASE_PATH || 'uploads', 'temp');
            console.log("tempPath: ", tempPath)
            await fs.ensureDir(tempPath);
            cb(null, tempPath);
        } catch (error) {
            cb(error);
        }
    },
    /**
   * Specifies the filename for uploaded files.
   * Generates a unique filename to prevent conflicts while preserving the original file extension.
   * 
   * @param {Object} req - The HTTP request object.
   * @param {Object} file - The file being uploaded.
   * @param {Function} cb - Callback function to specify the filename.
   */

    filename: function(req, file, cb){
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    cb(null, true);
}

export const upload = multer({
    storage: storage, 
    fileFilter: fileFilter,
    limits: {
        fileSize: 30 * 1024 * 1024 
    }
});


export const moveFileToFinalDestination = async (tempPath, studentId, fileTypeId) => {
    try {
        const finalDir = path.join(
            process.env.UPLOAD_BASE_PATH,
            studentId.toString(),
            fileTypeId.toString()
        );
        await fs.mkdir(finalDir, { recursive: true });

        const fileName = path.basename(tempPath);
        const finalPath = path.join(finalDir, fileName);

        await fs.rename(tempPath, finalPath);

        const relativePath = path.relative(process.env.UPLOAD_BASE_PATH, finalPath).replace(/\\/g, '/');
        
        const numberOfPages = await getPageCount(finalPath);

        return { 
            relativePath, 
            numberOfPages 
        };

    } catch (error) {
        throw error;
    }
};
import fs from 'fs-extra';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();


class FileManager{
    constructor(){
        this.basePath = process.env.UPLOAD_BASE_PATH
    }

    ensureUploadPath = async(studentId, fileTypeId) => {
        const uploadPath = path.join(
            this.basePath,
            studentId.toString(),
            fileTypeId.toString()
        );
        await fs.ensureDir(uploadPath);
        return uploadPath;
    }

    deleteFile = async (filePath) => {
        const fullPath = path.join(
            this.basePath,
            filePath
        )
        try{
            await fs.remove(fullPath);
            return true;
        }catch(error){
            console.error(`Error deleting file: ${error.message}`);
            return false;
        }
    }

    getFilePath = async (relativePath) => {
        return path.join(this.basePath, relativePath);
    }

    getFileSize = async (relativePath) => {
        try {
            const fullPath = await this.getFilePath(relativePath);
            console.log("FULLPATH ", fullPath)
            const stats = await fs.stat(fullPath);
            return stats.size;
        } catch (error) {
            console.error(`Error getting file size: ${error.message}`);
            return 0;
        };
    }
}

export default new FileManager();
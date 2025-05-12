import BaseRepository from './BaseRepository.js';
import File from '../models/File.js';
import FileManager from '../utils/FileManager.js';

/**
 * Lớp Repository để xử lý cấu hình in ấn
 * @extends BaseRepository
 */
class FileRepository extends BaseRepository {
    /**
     * Khởi tạo một instance
     */
    constructor() {
        super(File, 'file');
    }
    /**
     * Lấy tất cả file từ cơ sở dữ liệu của 1 student
     * @returns {Promise<Array<File>>} Mảng các đối tượng file
     * @throws {Error} Nếu truy vấn cơ sở dữ liệu thất bại
     */
    findByStudentId = async (studentId) => {
        try {

            const [rows] = await this.db.query(`SELECT * FROM ${this.tableName} WHERE student_id = ?`, [studentId]);
            console.log(rows);
            const fileWithSize = await Promise.all(rows.map(async (file) => {
                const size = await FileManager.getFileSize(file.file_path);
                return {... file, size}
            }));
            console.log(`Files for student ID ${studentId}: `, fileWithSize);
            return fileWithSize;
        } catch (error) {
            throw new Error(`Error fetching files for student ID ${studentId}: ${error.message}`);
        }
    }
  

    /**
     * Xoas tất cả file từ cơ sở dữ liệu của 1 student
     * @returns {Promise<Array<File>>} Mảng các đối tượng file
     * @throws {Error} Nếu truy vấn cơ sở dữ liệu thất bại
     */
    deleteByStudentId = async (studentId) =>  {
        try {
            const result = await this.db.query(`DELETE FROM ${this.tableName} WHERE student_id = ?`, [studentId]);
            console.log(`Deleted files for student ID ${studentId}.`);
            return result;
        } catch (error) {
            throw new Error(`Error deleting files for student ID ${studentId}: ${error.message}`);
        }
    }

    deleteByFileId = async (fileId) =>  {
        try {
            const result = await this.db.query(`DELETE FROM ${this.tableName} WHERE file_id = ?`, [fileId]);
            console.log(`Deleted files for file ID ${fileId}.`);
            return result;
        } catch (error) {
            throw new Error(`Error deleting files for student ID ${fileId}: ${error.message}`);
        }
    }
}

export default FileRepository;
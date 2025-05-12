import BaseRepository from './BaseRepository.js';
import Printer from '../models/Printer.js';

/**
 * Lớp Repository để xử lý các thao tác cơ sở dữ liệu liên quan đến máy in    
 * @extends BaseRepository
 */
class PrinterRepository extends BaseRepository {
    /**
     * Khởi tạo một instance của PrinterRepository
     */
    constructor() {
        super(Printer, 'printer');
    }

    /**
     * Lấy tất cả máy in từ cơ sở dữ liệu
     * @returns {Promise<Array<Printer>>} Mảng các đối tượng máy in
     * @throws {Error} Nếu truy vấn cơ sở dữ liệu thất bại
     */
    async findAll() {
        try {
            const [rows] = await this.db.query(`SELECT * FROM ${this.tableName}`);
            console.log("Danh sách máy in trong phương thức findAll: ", rows);
            return rows;
        } catch (error) {
            throw new Error(`Lỗi khi lấy danh sách máy in: ${error.message}`);
        }
    }

    /**
     * Cập nhật trạng thái của máy in
     * @param {number} printerId - ID của máy in
     * @param {string} status - Trạng thái mới ('enable' hoặc 'disable')
     * @returns {Promise<Printer>} Đối tượng máy in đã được cập nhật
     * @throws {Error} Nếu cập nhật thất bại
     */
    async updateStatus(printerId, status) {
        try {
            console.log(this.tableName)
            console.log(printerId)
            console.log(status)
            await this.db.query(
                `UPDATE ${this.tableName} SET status = ?, update_at = NOW() WHERE printer_id = ?`, [status, printerId]
            );
            return this.findById(printerId);
        } catch (error) {
            throw new Error(`Lỗi khi cập nhật trạng thái máy in: ${error.message}`);
        }
    }
}

export default PrinterRepository;
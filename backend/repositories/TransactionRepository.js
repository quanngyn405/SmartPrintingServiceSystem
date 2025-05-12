import BaseRepository from './BaseRepository.js';
import Transaction from '../models/Transaction.js';

/**
 * Lớp Repository để xử lý cấu hình in ấn
 * @extends BaseRepository
 */
class TransactionRepository extends BaseRepository {
    /**
     * Khởi tạo một instance
     */
    constructor() {
        super(Transaction, 'transaction');
    }

    async findAll() {
        try {
            const [rows] = await this.db.query(`SELECT * FROM ${this.tableName}`);
            console.log("Danh sách thanh toán trong phương thức findAll: ", rows);
            const objectTransactions = rows.map(row => new Transaction(row));
            return objectTransactions;
        } catch (error) {
            throw new Error(`Lỗi khi lấy danh sách hóa đơn: ${error.message}`);
        }
    }

    async findByStudentId(studentId) {
        try {
            const [rows] = await this.db.query(`SELECT * FROM ${this.tableName} WHERE student_id = ?`, [studentId]);
            console.log(`Transactions for student ID ${studentId}: `, rows);
            // const objectTransactions = rows.map(row => new Transaction(row));
            return rows;
        } catch (error) {
            throw new Error(`Error fetching transactions for student ID ${studentId}: ${error.message}`);
        }
    }
    
}

export default TransactionRepository;
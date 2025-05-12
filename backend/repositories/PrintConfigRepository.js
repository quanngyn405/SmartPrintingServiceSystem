import BaseRepository from './BaseRepository.js';
import PrintConfig from '../models/PrintConfig.js';

/**
 * Lớp Repository để xử lý cấu hình in ấn
 * @extends BaseRepository
 */
class PrintConfigRepository extends BaseRepository {
    /**
     * Khởi tạo một instance
     */
    constructor() {
        super(PrintConfig, 'print_config');
    }

    /**
     * Lấy cấu hình in mặc định
     * @returns {Promise<PrintConfig>} Cấu hình in mặc định
     * @throws {Error} Nếu quá trình lấy dữ liệu thất bại
     */
    getDefaultConfig = async () => {
        try {
            const [rows] = await this.db.query(
                `SELECT * FROM ${this.tableName} ORDER BY create_at LIMIT 1`
            );
            
            return rows.length ? new PrintConfig(rows[0]) : PrintConfig.createDefault();
        } catch (error) {
            console.error(`Error getting default config: ${error.message}`);
            throw new Error(`Failed to retrieve default print configuration: ${error.message}`);
        }
    }
}

export default PrintConfigRepository;
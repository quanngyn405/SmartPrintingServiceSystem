import BaseRepository from './BaseRepository.js';
import User from '../models/User.js';

/**
 * Lớp Repository để xử lý cấu hình in ấn
 * @extends BaseRepository
 */
class UserRepository extends BaseRepository {
    /**
     * Khởi tạo một instance
     */
    constructor() {
        super(User, 'user');
    }

     
}

export default UserRepository;
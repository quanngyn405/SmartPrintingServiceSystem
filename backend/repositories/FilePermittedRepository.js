import BaseRepository from './BaseRepository.js';
import FilePermitted from '../models/PermittedFileType.js';

/**
 * @extends BaseRepository
 */
class FilePermittedRepository extends BaseRepository {
    /**
     * Khởi tạo một instance
     */
    constructor() {
        super(FilePermitted, 'permitted_file_type');
    }

    /**
     * @returns {Promise<FilePermitted>} 
     * @throws {Error} 
     */
    getFilePermitted = async () => {
        try {

            const permittedFileTypes = await FilePermitted.showPermittedFileType(this.db);
            return permittedFileTypes.length ? permittedFileTypes : null;
        } catch (error) {
            console.error(`Error getting permitted file type: ${error.message}`);
            throw new Error(`Failed to retrieve permitted file type: ${error.message}`);
        }

    };

}

export default FilePermittedRepository;
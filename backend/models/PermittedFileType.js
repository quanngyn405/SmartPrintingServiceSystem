class PermittedFileType {
    constructor({ fileTypeId, mimeType }) {
        this.fileTypeId = fileTypeId;
        this.mimeType = mimeType;
    }

    static async showPermittedFileType(db) {
        try {
            const [rows] = await db.query(`SELECT * FROM permitted_file_type ORDER BY file_type_id`);
            // return rows.map(row => new PermittedFileType(row));
            return rows;
        } catch (error) {
            console.error(`Error getting permitted file types: ${error.message}`);
            throw new Error(`Failed to retrieve permitted file types: ${error.message}`);
        }
    }
}


  
 export default PermittedFileType;


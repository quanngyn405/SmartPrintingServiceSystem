class File {
    constructor({
        fileId,
        studentId,
        fileTypeId,
        filePath,
        filename,
        status,
        sizeInBytes,
        uploadAt,
    }) {
        this.fileId = fileId;
        this.studentId = studentId;
        this.fileTypeId = fileTypeId;
        this.filePath = filePath;
        this.filename = filename;
        this.status = status || 'uploaded';
        this.sizeInBytes = sizeInBytes;
        this.uploadAt = uploadAt || new Date();
    }
    
}

export default File;
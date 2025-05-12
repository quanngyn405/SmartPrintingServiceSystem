import "./PrintPage.css";
import NavigationBar from "../../component/NavigationBar";
import { useDropzone } from "react-dropzone";
import { useState, useEffect } from "react";
import { FaCloudUploadAlt, FaPrint, FaTrashAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const studentInfo = localStorage.getItem("studentInfo");



function PrintPage() {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [permittedFileTypes, setPermittedFileTypes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const filesPerPage = 4;
  const studentId = JSON.parse(studentInfo).student_id;
  const navigate = useNavigate();

  useEffect(() => {
    fetchPermittedFileTypes();
    fetchUploadedFiles();
  }, []);

  const fetchPermittedFileTypes = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/files/uploadpermit");

      const result = await response.json();
      console.log(result.data);

      if (result.success) {
        setPermittedFileTypes(result.data.map((type) => type.mime_type));
      } else {
        toast.error("Failed to fetch permitted file types.");
      }
    } catch (error) {
      console.error("Error fetching permitted file types:", error);
      toast.error("Error fetching permitted file types from the server.");
    }
  };

  const fetchUploadedFiles = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/files/${studentId}`);
      const result = await response.json();

      if (result.success) {
        setUploadedFiles(result.files);
      } else {
        toast.error("No files to fetch");
      }
    } catch (error) {
      console.error("Error fetching uploaded files:", error);
      toast.error("Error fetching uploaded files from the server.");
    }
  };

  const uploadFileToServer = async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('student_id', studentId.toString());
      const fileTypeId = determineFileTypeId(file);
      formData.append('file_type_id', fileTypeId.toString());

      console.log('Uploading with:');
      console.log('Student ID:', studentId);
      console.log('File Type ID:', fileTypeId);
      for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }
      const response = await fetch("http://localhost:5000/api/files/upload", {
        method: "POST",
        body: formData
      });

      const result = await response.json();

      if (result.success) {
        toast.success("File uploaded successfully!");
        fetchUploadedFiles();
      } else {
        toast.error(result.message || "File upload failed.");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Error uploading file to the server.");
    }
  };

  const handleDeleteFile = async (fileId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/files/${fileId}`, {
        method: 'DELETE',
      });
      const result = await response.json();

      if (result.success) {
        toast.success("File deleted successfully!");
        fetchUploadedFiles();
      } else {
        toast.error(result.message || "Failed to delete file.");
      }
    } catch (error) {
      console.error("Error deleting file:", error);
      toast.error("Error deleting file from the server.");
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      acceptedFiles.forEach((file) => {
        if (permittedFileTypes.includes(file.type)) {
          uploadFileToServer(file);
        } else {
          toast.error(
            <>
              Invalid file type: <strong>{file.name}</strong>
              <br />
              Allowed types: {permittedFileTypes.join(", ")}
            </>
          );
        }
      });
    },
    accept: permittedFileTypes.reduce((acc, type) => {
      acc[type] = [];
      return acc;
    }, {}),
  });

  const handlePrint = async (file) => {

    navigate("/Print/PrintConfig", {
      state: { file },
    });
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const indexOfLastFile = currentPage * filesPerPage;
  const indexOfFirstFile = indexOfLastFile - filesPerPage;
  const currentFiles = uploadedFiles.slice(indexOfFirstFile, indexOfLastFile);
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(uploadedFiles.length / filesPerPage); i++) {
    pageNumbers.push(i);
  }

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const determineFileTypeId = (file) => {
    const fileType = permittedFileTypes.find((type) => type === file.type);
    return fileType ? permittedFileTypes.indexOf(fileType) + 1 : null;
  };

  return (
    <div>
      <NavigationBar />
      <ToastContainer />
      <div className="print_container">
        <div className="drag_container">
          <motion.div
            className="drag"
            {...getRootProps({ className: "dropzone" })}
            initial={{ opacity: 0.8, scale: 0.95 }}
            whileHover={{ scale: 1.05, boxShadow: "0px 4px 8px rgba(0,0,0,0.3)" }}
            transition={{ duration: 0.3 }}
          >
            <input {...getInputProps()} />
            <FaCloudUploadAlt className="upload-icon" />
            <p className="text">Drag and drop your files here</p>
            <p className="text1">-- Or --</p>
            <button >Browse</button>
          </motion.div>
        </div>

        <div className="file_list_container">
          <h3>List of Documents</h3>
          {console.log("Filename: ", currentFiles)}
          {uploadedFiles.length > 0 ? (
            <>
              <ul className="file_list">
                {currentFiles.map((file) => (
                  <motion.li
                    key={file.file_id}
                    className="file_item"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.03, backgroundColor: "#f9f9f9" }}
                    transition={{ duration: 0.3 }}
                  >

                    <div className="file_info">
                      <span className="filename">{file.filename}</span>
                      <span className="filesize">{formatFileSize(file.size)}</span>

                    </div>
                    <div className="file_actions">
                      <motion.button
                        className="print_button"
                        onClick={() => handlePrint(file)}
                        whileHover={{ scale: 1.2, color: "#4caf50" }}
                        title="Print file"
                      >
                        <FaPrint size={20} />
                      </motion.button>
                      <motion.button
                        className="remove_button"
                        onClick={() => handleDeleteFile(file.file_id)}
                        whileHover={{ scale: 1.2, color: "#f44336" }}
                        title="Delete file"
                      >
                        <FaTrashAlt size={20} />
                      </motion.button>
                    </div>
                  </motion.li>
                ))}
              </ul>

              <div className="pagination">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  {"<<"}
                </button>
                {pageNumbers.map((number) => (
                  <button
                    key={number}
                    onClick={() => paginate(number)}
                    className={currentPage === number ? "active" : ""}
                  >
                    {number}
                  </button>
                ))}
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === pageNumbers.length}
                >
                  {">>"}
                </button>
              </div>
            </>
          ) : (
            <p className="no-files">No files uploaded yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default PrintPage;

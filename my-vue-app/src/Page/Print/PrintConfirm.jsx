import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import './PrintConfirm.css';
import NavigationBar from '../../component/NavigationBar';

const studentInfo = localStorage.getItem("studentInfo");


function PrintConfirm() {
  const location = useLocation();
  const navigate = useNavigate();
  const { printJobData, file, fileName, copies, paperSize, totalPages, remainingPages, locationToGetFile } = location.state || {};
  console.log(printJobData)

  const studentId = JSON.parse(studentInfo).student_id
  console.log(printJobData)

  const [showModal, setShowModal] = useState(false);

  if (!fileName) {
    return <div>No file selected for print confirmation</div>;
  }

  const handleCancel = () => {
    navigate("/Print/PrintConfig", {
      state: {
        printJobData,
        file,
        fileName,
        copies,
        paperSize,
        totalPages,
        remainingPages,
        locationToGetFile
      }
    });
  };

  const handleConfirm = async () => {
    const response = await fetch('http://localhost:5000/api/print-jobs', {
        method: 'POST',
          headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(printJobData)
    });

    if (response.ok){
      setShowModal(true);

      let studentInfo = localStorage.getItem("studentInfo");

      studentInfo = JSON.parse(studentInfo);
      studentInfo.page_balance = remainingPages;
      
      const updatedStudentInfo = JSON.stringify(studentInfo);
      localStorage.removeItem('studentInfo')
      localStorage.setItem("studentInfo", updatedStudentInfo);
      console.log("SECOND: ", JSON.parse(localStorage.getItem("studentInfo")))
    }
    else{
      console.error("Error")
    }
  };

  const handleCloseModal = () => {
    setShowModal(false); // Ẩn modal
    navigate("/Print"); 
  };

  return (
    <>
      <NavigationBar />
      <div className={`print-confirm-container ${showModal ? 'blur-background' : ''}`}>
        <div className="print-confirm-box">
          <h3>Print Confirmation</h3>
          <hr />
          <div className="print-details">
            <p><strong>File Name:</strong> {fileName}</p>
            <p><strong>Number of copies:</strong> {copies}</p>
            <p><strong>Type of Page:</strong> {paperSize}</p>
            <p><strong>Number of Pages after Conversion:</strong> {totalPages}</p>
            <p><strong>Remaining Pages:</strong> {remainingPages}</p>
            <p><strong>Location to Pick Up:</strong> {locationToGetFile}</p>
          </div>
          <div className="buttonss">
            <button className="cancel-bu" onClick={handleCancel}>Cancel</button>
            <button className="confirm-btn" onClick={handleConfirm}>Confirm</button>
          </div>
        </div>
        <div className='buff'>
          <h2>Hello</h2>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Notification</h3>
            <hr />
            <p>Print order successful, please get the document at <strong>{locationToGetFile}</strong>.</p>
            <hr />
            <button className="ok-btn" onClick={handleCloseModal}>OK</button>
          </div>
        </div>
      )}
    </>
  );
}

export default PrintConfirm;

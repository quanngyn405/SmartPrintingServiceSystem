import { useState, useEffect } from "react";
import "./SPSO_History.css";
import NavigationBar_Ad from "../../component/NavigationBar_Ad";

function Admin_History() {
  const [historyData, setHistoryData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const itemsPerPage = 20;

  useEffect(() => {
    const fetchHistoryData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`http://localhost:5000/api/print-jobs`);
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const responseData = await response.json();
        const historyArray = Array.isArray(responseData.data) ? responseData.data : [];

        setHistoryData(
          historyArray.map((item) => ({
            student_id: item.student_id,
            file_name: item.files?.names?.[0] || "Unknown File",
            printer_id: item.printer_id,
            total_pages: item.number_of_copies,
            pages_to_print: item.pages_to_print,
            paper_size: item.paper_size,
            start_time: new Date(item.print_start_time).toLocaleString(),
            end_time: new Date(item.print_end_time).toLocaleString(),
          }))
        );
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistoryData();
  }, []);

  const totalPages = Math.ceil(historyData.length / itemsPerPage);

  const currentData = historyData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleRowClick = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <NavigationBar_Ad />
      <div className="admin-history-page">
        <table className="admin-history-table">
          <thead>
            <tr>
              <th>Student ID</th>
              <th>File Name</th>
              <th>Printer</th>
              <th>No. of Pages</th>
              <th>Start Time</th>
              <th>End Time</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((item, index) => (
              <tr key={index} onClick={() => handleRowClick(item)}>
                <td>{item.student_id}</td>
                <td>{item.file_name}</td>
                <td>{item.printer_id}</td>
                <td>{item.total_pages}</td>
                <td>{item.start_time}</td>
                <td>{item.end_time}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="admin-pagination-history">
          <button
            className="admin-pagination-button"
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
          >
            ◀
          </button>
          <span className="admin-pagination-info">
            {currentPage} / {totalPages}
          </span>
          <button
            className="admin-pagination-button"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            ▶
          </button>
        </div>
      </div>

      {isModalOpen && selectedItem && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Detailed Information</h2>
            <hr />
            <div>
              <h3>Print Order Information</h3>
              <p><strong>Student ID:</strong> {selectedItem.student_id}</p>
              <p><strong>Printer ID:</strong> {selectedItem.printer_id}</p>
              <p><strong>No. of Pages:</strong> {selectedItem.total_pages}</p>
              <p><strong>Start Time:</strong> {selectedItem.start_time}</p>
              <p><strong>End Time:</strong> {selectedItem.end_time}</p>
            </div>
            <hr />
            <div>
              <h3>File Information</h3>
              <p><strong>File Name:</strong> {selectedItem.file_name}</p>
              <p><strong>Type of Page:</strong> {selectedItem.paper_size}</p>
              <p><strong>Pages to Print:</strong> {selectedItem.pages_to_print}</p>
            </div>
            <button className="modal-ok-button" onClick={handleCloseModal}>OK</button>
          </div>
        </div>
      )}
    </>
  );
}

export default Admin_History;

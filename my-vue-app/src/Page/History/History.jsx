import React, { useState, useEffect } from "react";
import "./History.css";
import NavigationBar from "../../component/NavigationBar";

const studentInfo = localStorage.getItem("studentInfo");

function History() {
  const [historyData, setHistoryData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const user_id = JSON.parse(studentInfo).student_id;
  const itemsPerPage = 20;

  useEffect(() => {
    const fetchHistoryData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`http://localhost:5000/api/print-jobs/${user_id}`);
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        setHistoryData(data.data || []);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistoryData();
  }, [user_id]);

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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <NavigationBar />
      <div className="history-page">
        <table className="history-table">
          <thead>
            <tr>
              <th>File Name</th>
              <th>Printer</th>
              <th>Pages to Print</th>
              <th>Paper Size</th>
              <th>Duplex</th>
              <th>Copies</th>
              <th>Print Start Time</th>
              <th>Print End Time</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((item, index) => (
              <tr key={index}>
                <td>{item.files?.names?.[0] || "N/A"}</td>
                <td>{item.printer_id}</td>
                <td>{item.pages_to_print}</td>
                <td>{item.paper_size}</td>
                <td>{item.duplex === 1 ? "Yes" : "No"}</td>
                <td>{item.number_of_copies}</td>
                <td>{new Date(item.print_start_time).toLocaleString()}</td>
                <td>{new Date(item.print_end_time).toLocaleString()}</td>
                
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pagination-history">
          <button className="pagination-button" onClick={handlePreviousPage} disabled={currentPage === 1}>
            ◀
          </button>
          <span className="pagination-info">
            {currentPage} / {totalPages}
          </span>
          <button className="pagination-button" onClick={handleNextPage} disabled={currentPage === totalPages}>
            ▶
          </button>
        </div>
      </div>
    </>
  );
}

export default History;

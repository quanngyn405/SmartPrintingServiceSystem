import { useState, useEffect } from "react";
import NavigationBar_Ad from "../../component/NavigationBar_Ad";
import "./Setup.css";

function Setup() {
  const [defaultPages, setDefaultPages] = useState("");
  const [allocations, setAllocations] = useState([
    { term: "241", pages: 100 }, // Default row
  ]);
  const [editIndex, setEditIndex] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  useEffect(() => {
    // Khi component load, lấy dữ liệu từ localStorage
    const savedAllocations = localStorage.getItem("allocations");
    const savedDefaultPages = localStorage.getItem("defaultPages");

    if (savedAllocations) {
      setAllocations(JSON.parse(savedAllocations));
    }

    if (savedDefaultPages) {
      setDefaultPages(savedDefaultPages);
    }
  }, []);

  const handleSetDefault = () => {
    if (!defaultPages || isNaN(defaultPages)) {
      alert("Please enter a valid number of pages.");
      return;
    }
    const nextTerm = getNextTerm(allocations[allocations.length - 1].term);
    const updatedAllocations = [...allocations, { term: nextTerm, pages: Number(defaultPages) }];
    setAllocations(updatedAllocations);
    localStorage.setItem("allocations", JSON.stringify(updatedAllocations)); // Lưu allocations vào localStorage
    setDefaultPages("");
    localStorage.setItem("defaultPages", ""); // Xóa giá trị defaultPages khỏi localStorage
  };

  const getNextTerm = (currentTerm) => {
    const year = parseInt(currentTerm.substring(0, 2));
    const semester = parseInt(currentTerm.substring(2));
    const nextSemester = semester === 3 ? 1 : semester + 1;
    const nextYear = semester === 3 ? year + 1 : year;
    return `${nextYear}${nextSemester}`;
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setEditValue(allocations[index].pages);
  };

  const handleSave = (index) => {
    if (!editValue || isNaN(editValue)) {
      alert("Please enter a valid number of pages.");
      return;
    }
    const updatedAllocations = [...allocations];
    updatedAllocations[index].pages = Number(editValue);
    setAllocations(updatedAllocations);
    localStorage.setItem("allocations", JSON.stringify(updatedAllocations)); // Lưu allocations sau khi thay đổi
    setEditIndex(null);
    setEditValue("");
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const displayedAllocations = allocations.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const totalPages = Math.ceil(allocations.length / rowsPerPage);

  return (
    <>
      <NavigationBar_Ad />
      <div className="setup-container">
        <h2>Setup Default Page Allocation</h2>

        {/* Form Section */}
        <div className="setup-form">
          <h3>Set Default Pages for New Term</h3>
          <div className="form-group">
            <label htmlFor="default-pages">Default Pages Allocated:</label>
            <input
              type="number"
              id="default-pages"
              value={defaultPages}
              onChange={(e) => setDefaultPages(e.target.value)}
              placeholder="Enter number of pages"
            />
          </div>
          <button className="set-btn" onClick={handleSetDefault}>
            Set Default
          </button>
        </div>

        {/* Allocation Table */}
        <div className="setup-table">
          <h3>Term Allocations</h3>
          <table>
            <thead>
              <tr>
                <th>Term</th>
                <th>Default Pages</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayedAllocations.map((allocation, index) => (
                <tr key={index}>
                  <td>{allocation.term}</td>
                  <td>
                    {allocation.term === "241" ? (
                      allocation.pages // Default term value cannot be edited
                    ) : editIndex === index ? (
                      <input
                        type="number"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                      />
                    ) : (
                      allocation.pages
                    )}
                  </td>
                  <td>
                    {allocation.term === "241" ? (
                      "Default" // No action for default term
                    ) : editIndex === index ? (
                      <button onClick={() => handleSave(index)}>Save</button>
                    ) : (
                      <button onClick={() => handleEdit(index)}>Edit</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="pagination-setup">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
              <button
                key={pageNumber}
                className={`page-btn ${pageNumber === currentPage ? "active" : ""}`}
                onClick={() => handlePageChange(pageNumber)}
              >
                {pageNumber}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Setup;

import  { useState, useEffect } from "react";
import NavigationBar_Ad from "../../component/NavigationBar_Ad";
import printerImage from "../../assets/printer.jpg";
import "./Manage.css";

function Manage() {
  const [printers, setPrinters] = useState([]); 
  const [selectedPrinterIndex, setSelectedPrinterIndex] = useState(null); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 
  const [showAddPrinterModal, setShowAddPrinterModal] = useState(false); 
  const [newPrinter, setNewPrinter] = useState({
    printer_name: "",
    brand_name: "",
    model: "",
    campus_name: "",
    building_name: "",
    room_number: "",
    status: "enabled",
  });

  useEffect(() => {
    const fetchPrinters = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:5000/api/printers");

        if (!response.ok) {
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        setPrinters(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load printer data. Please try again later.");
        setLoading(false);
      }
    };

    fetchPrinters();
  }, []);


  const fetchPrinters = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/printers");

      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      setPrinters(data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load printer data. Please try again later.");
      setLoading(false);
    }
  };

  const openPrinterDetailsModal = (index) => {
    setSelectedPrinterIndex(index);
  };

  const closePrinterDetailsModal = () => {
    setSelectedPrinterIndex(null);
  };


  const handleStatusUpdate = async () => {
    const printer = printers[selectedPrinterIndex];
    try {
      const response = await fetch(`http://localhost:5000/api/printers/${printer.printer_id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: printer.status }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to update printer status');
      }
      await fetchPrinters();
  
        
      closePrinterDetailsModal();

    } catch (err) {
      alert('Error updating printer status: ' + err.message);
    }
  };

  const openAddPrinterModal = () => setShowAddPrinterModal(true);
  const closeAddPrinterModal = () => {
    setShowAddPrinterModal(false);
    setNewPrinter({
      printer_name: "",
      brand_name: "",
      model: "",
      campus_name: "",
      building_name: "",
      room_number: "",
      status: "enabled",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPrinter((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddPrinterSubmit = async (e) => {
    e.preventDefault();
    console.log(newPrinter)
    try {
      const response = await fetch("http://localhost:5000/api/printers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPrinter),
      });

      if (!response.ok) {
        throw new Error("Failed to add printer");
      }

      const addedPrinter = await response.json();
      setPrinters((prev) => [...prev, addedPrinter.printer]);
      closeAddPrinterModal();
    } catch (err) {
      alert("Error adding printer: " + err.message);
    }
  };

  return (
    <>
      <NavigationBar_Ad />
      <div className="manage-container">
        <h1>Printer Lists</h1>
        <div className="header">
          <button className="add-printer-button" onClick={openAddPrinterModal}>
            Add New Printer
          </button>
        </div>

        {/* Error message */}
        {error && <div className="error-message">{error}</div>}

        {/* Loading state */}
        {loading ? (
          <div className="loading">Loading printers...</div>
        ) : (
          <div className="grid-container">
            {printers.map((printer, index) => (
              <div
                key={`${printer.model}-${index}`} 
                className={`printer-item ${printer.status === "disabled" ? "inactive" : ""}`}
              >
                <img
                  src={printerImage}
                  alt={printer.model}
                  className="printer-image"
                />
                <button
                  className="printer-name"
                  onClick={() => openPrinterDetailsModal(index)}
                >
                  {printer.printer_name} - {printer.model}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedPrinterIndex !== null && (
    <div className="modal-overlay">
  <div className="modal modal-printer-details">
    <h2>{printers[selectedPrinterIndex].printer_name} - {printers[selectedPrinterIndex].model}</h2>
    <p className="campus"><strong>Campus:</strong> {printers[selectedPrinterIndex].campus_name}</p>
    <p className="location"><strong>Location:</strong> {printers[selectedPrinterIndex].building_name}</p>
    <p className="room"><strong>Room:</strong> {printers[selectedPrinterIndex].room_number}</p>
    <p className="status">
      <strong>Status:</strong>
      <select
        value={printers[selectedPrinterIndex].status}
        onChange={(e) => {
          const updatedStatus = e.target.value;
          setPrinters((prev) =>
            prev.map((printer, index) =>
              index === selectedPrinterIndex ? { ...printer, status: updatedStatus } : printer
            )
          );
        }}
      >
        <option value="enabled">Enabled</option>
        <option value="disabled">Disabled</option>
      </select>
    </p>
    {/* Thay thế nút Close thành X ở góc trên bên phải */}
    <span className="close-button" onClick={closePrinterDetailsModal}>X</span>
    <button className="confirm-button" onClick={handleStatusUpdate}>Confirm Status Update</button>
  </div>
</div>

      )}

      {/* Modal for adding new printer */}
      {showAddPrinterModal && (
        <div className="modal-overlay">
          <div className="modal modal-add-printer">
            <h2>Add New Printer</h2>
            <form onSubmit={handleAddPrinterSubmit}>
              <label>
                Printer Name:
                <input
                  type="text"
                  name="printer_name"
                  value={newPrinter.printer_name}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label>
                Brand Name:
                <input
                  type="text"
                  name="brand_name"
                  value={newPrinter.brand_name}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label>
                Model:
                <input
                  type="text"
                  name="model"
                  value={newPrinter.model}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label>
                Campus Name:
                <input
                  type="text"
                  name="campus_name"
                  value={newPrinter.campus_name}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label>
                Building Name:
                <input
                  type="text"
                  name="building_name"
                  value={newPrinter.building_name}
                  onChange={handleInputChange}
                  required
                />
              </label>

              <label>
                Room Name:
                <input
                  type="text"
                  name="room_number"
                  value={newPrinter.room_number}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label>
                Status:
                <select
                  name="status"
                  value={newPrinter.status}
                  onChange={handleInputChange}
                >
                  <option value="enabled">Enabled</option>
                  <option value="disabled">Disabled</option>
                </select>
              </label>
              <button type="submit">Add Printer</button>
              <button type="button" onClick={closeAddPrinterModal}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default Manage;

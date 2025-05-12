import React, { useState } from "react";
import NavigationBar from "../../component/NavigationBar";
import "./PagePurchase.css";




function PagePurchase() {
  const [numPages, setNumPages] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("bkpay");
  const pricePerPage = 500;
  const totalPrice = numPages * pricePerPage;
  //! NOTES---------------------------------------------
  // const studentId = localStorage.getItem("student_id");
  const studentId = 1;
  //! --------------------------------------------------
  const handleCancel = () => {
    window.history.back(); 
  };

  const handlePurchase = async () => {
    if (numPages < 1) {
      alert("Please enter a valid number of pages.");
      return;
    }

    const transactionData = {
      student_id: studentId, 
      amount_paid: totalPrice,
      transaction_date: new Date().toISOString().split('T')[0], 
      payment_method: paymentMethod,
    };

    try {
      const response = await fetch("http://localhost:5000/api/transactions/purchase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transactionData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        alert(`Purchase successful! You have purchased ${numPages} pages for ${totalPrice} VND.`);
        let studentInfo = localStorage.getItem("studentInfo");

        studentInfo = JSON.parse(studentInfo);
        studentInfo.page_balance = (studentInfo.page_balance || 0) + numPages;
        
        const updatedStudentInfo = JSON.stringify(studentInfo);
        localStorage.removeItem('studentInfo')
        localStorage.setItem("studentInfo", updatedStudentInfo);
        console.log("SECOND: ", JSON.parse(localStorage.getItem("studentInfo")))

      } else {
        alert(`Purchase failed: ${result.message || "Unknown error occurred."}`);
      }
    } catch (error) {
      console.error("Error processing purchase:", error);
      alert("An error occurred while processing your purchase. Please try again.");
    }
  };

  return (
    <>
      <NavigationBar />
      <div className="page-purchase">
        <h1 className="title">Page Purchase</h1>
        <a href="#" className="price-info">
          Price: {pricePerPage} VND/A4 page
        </a>

        <form className="purchase-form">
          <div className="form-group">
            <label>Enter the number of pages:</label>
            <input
              type="number"
              min="1"
              value={numPages}
              onChange={(e) => setNumPages(Number(e.target.value))}
            />
          </div>

          <div className="form-group">
            <label>Total price:</label>
            <input type="text" value={totalPrice} readOnly />
          </div>

          <div className="form-group">
            <label>Select Payment Method</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="bkpay">BK PAY</option>
              <option value="bank">Bank Transfer</option>
              <option value="momo">MoMo</option>
            </select>
          </div>

          <div className="button-group">
            <button type="button" className="cancel-button" onClick={handleCancel}>
              Cancel
            </button>
            <button type="button"
              className="purchase-button"
              onClick={handlePurchase}
            >
              Purchase
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default PagePurchase;
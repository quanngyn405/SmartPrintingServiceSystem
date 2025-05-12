import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavigationBar from "../../component/NavigationBar";
import './Dashboard.css';

const studentInfo = localStorage.getItem("studentInfo");

function Dashboard() {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState(null);

    const userName = JSON.parse(studentInfo).user_name;

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/users/student/${userName}`);
                if (!response.ok) {
                    throw new Error(`Error: ${response.statusText}`);
                }
                const data = await response.json();

                console.log(data.data)
                setUserData(data.data);
            } catch (err) {
                console.error("Failed to fetch user data:", err);
                setError(err.message);
            }
        };

        fetchUserData();
    }, []);

    const handlePagePurchase = () => {
        navigate("/page-purchase");
    };

    const handleTransactionHistory = () => {
        navigate("/transaction-history");
    };

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!userData) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <NavigationBar />
            <div className="dashboard">
                <h1 className="dashboard-title">Student Dashboard</h1>
                
                <section className="student-info">
                    <h2>👤 Student Information</h2>
                    <p><strong>Full Name:</strong> {userData.user_name}</p>
                    <p><strong>Email:</strong> {userData.email}</p>
                    <p><strong>Role:</strong> {userData.role}</p>
                    <p><strong>ID:</strong> {userData.student_id}</p>
                    <p><strong>Current Semester:</strong> {userData.semester_name || "N/A"}</p>
                    <p><strong>Start Date:</strong> {new Date(userData.start_date).toLocaleDateString()}</p>
                    <p><strong>End Date:</strong> {new Date(userData.end_date).toLocaleDateString()}</p>
                </section>

                <section className="balance-info">
                    <h2>📂 Balance Information</h2>
                    <p><strong>Default Page Allocation:</strong> {userData.page_allocated || 0}</p>
                
                    <p className="p"><strong>Current Balance:</strong> {userData.page_balance }</p>
                    <div className="balance-display">
                        <span className="balance-amount">{userData.page_balance}</span>
                        <span className="balance-label">Page Balance</span>
                    </div>
                    <button className="page-purchase-button" onClick={handlePagePurchase}>Page Purchase</button>
                    <button className="transaction-link" onClick={handleTransactionHistory}>
                        View Transaction History
                    </button>
                </section>
            </div>
        </>
    );
}

export default Dashboard;

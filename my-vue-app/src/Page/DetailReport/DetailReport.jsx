import  { useState, useEffect } from "react";
import NavigationBar_Ad from "../../component/NavigationBar_Ad";
import { useLocation } from "react-router-dom";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import "./DetailReport.css";

ChartJS.register(ArcElement, Tooltip, Legend);

function DetailReport() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const month = queryParams.get("month");
  const year = queryParams.get("year");

  const [printerStats, setPrinterStats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPrintJobs = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch data from API
        const response = await fetch("http://localhost:5000/api/print-jobs");
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        const printJobs = data.data || [];

        // Filter print jobs by selected month and year
        const filteredJobs = printJobs.filter((job) => {
          const jobDate = new Date(job.print_start_time);
          return (
            jobDate.getMonth() + 1 === parseInt(month) &&
            jobDate.getFullYear() === parseInt(year)
          );
        });

        // Aggregate printer data
        const printerData = filteredJobs.reduce((acc, job) => {
          const printerId = job.printer_id;
          const existingPrinter = acc.find((printer) => printer.id === printerId);

          if (existingPrinter) {
            existingPrinter.orders += 1; // Increment order count
          } else {
            acc.push({
              id: printerId,
              name: `Printer ${printerId}`, // Placeholder name
              orders: 1,
            });
          }

          return acc;
        }, []);

        setPrinterStats(printerData);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrintJobs();
  }, [month, year]);

  // Prepare data for the pie chart
  const pieChartData = {
    labels: printerStats.map((printer) => printer.name),
    datasets: [
      {
        data: printerStats.map((printer) => printer.orders),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
      },
    ],
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
      <div className="dreport-container">
        <h1>Detailed Statistics of {month} - {year}</h1>

        {/* Statistics Table */}
        <table className="dreport-table">
          <thead>
            <tr>
              <th>No.</th>
              <th>Printer</th>
              <th>Number of Orders</th>
            </tr>
          </thead>
          <tbody>
            {printerStats.map((printer, index) => (
              <tr key={printer.id}>
                <td>{index + 1}</td>
                <td>{printer.name}</td>
                <td>{printer.orders}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pie Chart Section */}
        <div className="pie-chart-container">
          <h2>Orders Distribution</h2>
          <Pie data={pieChartData} />
        </div>
      </div>
    </>
  );
}

export default DetailReport;

import  { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import NavigationBar_Ad from "../../component/NavigationBar_Ad";
import "./Report.css";

function Report() {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReportsFromPrintJobs = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Gọi API lấy dữ liệu print-jobs
        const response = await fetch("http://localhost:5000/api/print-jobs");
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        const printJobs = data.data || [];

        // Trích xuất thông tin tháng, năm từ print_start_time
        const aggregatedReports = printJobs.reduce((acc, job) => {
          const date = new Date(job.print_start_time);
          const month = date.getMonth() + 1; // Lấy tháng (0-11, cần +1)
          const year = date.getFullYear();
          const detail = `SPSS Report ${month} - ${year}`;

          // Kiểm tra nếu tháng và năm đã tồn tại thì bỏ qua
          const existingReport = acc.find(
            (report) => report.month === month.toString() && report.year === year.toString()
          );

          if (!existingReport) {
            acc.push({
              month: month.toString(),
              year: year.toString(),
              detail,
            });
          }

          return acc;
        }, []);

        // Sắp xếp danh sách báo cáo theo thứ tự thời gian giảm dần
        aggregatedReports.sort(
          (a, b) =>
            new Date(b.year, b.month - 1).getTime() -
            new Date(a.year, a.month - 1).getTime()
        );

        setReports(aggregatedReports);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReportsFromPrintJobs();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <NavigationBar_Ad />
      <div className="container">
        <h1>System Report</h1>
        <table>
          <thead>
            <tr>
              <th>Month</th>
              <th>Year</th>
              <th>Detail</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report, index) => (
              <tr key={index}>
                <td>{report.month}</td>
                <td>{report.year}</td>
                <td>
                  <Link
                    to={`/detail-report?month=${report.month}&year=${report.year}`}
                    className="report-link"
                  >
                    {report.detail}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default Report;

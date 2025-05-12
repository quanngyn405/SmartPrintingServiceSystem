import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import HomePage from "./Page/Home/Home.jsx";
import ChooseRole from "./Page/Role/Role.jsx";
import Login from "./Page/Login/Login.jsx";
import User_HomePage from "./Page/Home_User/Home_User.jsx";
import PrintPage from "./Page/Print/PrintPage.jsx";
import PrintConfig from "./Page/Print/PrintConfig.jsx";
import Login_Admin from "./Page/Login/Login_Admin.jsx";
import Admin_HomePage from "./Page/Home_Admin/Home_Admin.jsx";
import PrintConfirm from "./Page/Print/PrintConfirm.jsx";
import Setup from "./Page/Setup/Setup.jsx";
import History from "./Page/History/History.jsx";
import Dashboard from "./Page/Dashboard/Dashboard.jsx";
import PagePurchase from "./Page/PagePurchase/PagePurchase.jsx";
import Help from "./Page/Help/Help.jsx";
import TransactionHistory from "./Page/TransactionHistory/TransactionHistory.jsx";
import Report from "./Page/Report/Report.jsx";
import DetailReport from "./Page/DetailReport/DetailReport.jsx";
import Admin_History from "./Page/SPSO_History/SPSO_History.jsx";
import Manage from "./Page/Manage/Manage.jsx";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/chooseRole" element={<ChooseRole />} />
        <Route path="/login/user" element={<Login />} />
        <Route path="/Homepage/User" element={<User_HomePage />} />
        <Route path="/Print" element={<PrintPage />} />
        <Route path="/Print/PrintConfig" element={<PrintConfig />} />
        <Route path="/login/admin" element={<Login_Admin />} />
        <Route path="/Homepage/Admin" element={<Admin_HomePage />} />
        <Route path="/Print/PrintConfirm" element={<PrintConfirm/>}/>
        <Route path="/Admin/Setup" element={<Setup/>} />
        <Route path="/profile" element={<Dashboard/>}/>
        <Route path="/page-purchase" element={<PagePurchase/>}/>
        <Route path="/Help" element={<Help/>}/>
        <Route path="/transaction-history" element={<TransactionHistory/>}/>
        <Route path="/history" element={<History/>}/>
        <Route path="/report" element={<Report />} />
      <Route path="/detail-report" element={<DetailReport />} />
      <Route path="/manage" element={<Manage/>}/>
      <Route path="/admin/history" element={<Admin_History/>}/>
      </Routes>
    </Router>
  );
}

export default App;
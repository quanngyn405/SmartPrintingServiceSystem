import NavigationBar from "../../component/NavigationBar";
import logo from "../../assets/logo.png";
import './Role.css'
import { FaUser } from "react-icons/fa6";
import { FaRegUser } from "react-icons/fa6";
import { Link } from "react-router-dom";

function ChooseRole(){
    return (<>
        <NavigationBar/>
        <div className="chooseRole">
            {/* truyen bien dung {} */}
            <img className="logo_role" src={logo} alt="logo" />
            <h1>Log in using your account on</h1>
            <div className="role">
               <Link to="/login/user" style={{ textDecoration: 'none', color: 'inherit' }}><span><FaUser size="50px"/>User</span></Link> 
               <Link to="/login/admin" style={{ textDecoration: 'none', color: 'inherit' }}>
  <span><FaRegUser size="50px"/>Admin</span>
</Link>
            </div>
        </div>
        </>
    );
}

export default ChooseRole;
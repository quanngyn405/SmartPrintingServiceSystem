import NavigationBar from "../../component/NavigationBar";
import './Help.css'

function Help(){
    return (<>
        <NavigationBar/>
        <div className="help">
            <div className="contact-card">
                <h2>CONTACT INFO</h2>
                <div className="content">
                    <p><strong>Email:</strong> <a href="mailto:techsupport@hcmut.edu.vn">techsupport@hcmut.edu.vn</a></p>
                    <p><strong>Tel.:</strong> (+84) 123 456 8910</p>
                    <p>For HCMUT account, please contact to:</p>
                    <p><strong>Data and Information Technology Center</strong></p>
                </div>
            </div>
        </div>
        </>
    );
}

export default Help;
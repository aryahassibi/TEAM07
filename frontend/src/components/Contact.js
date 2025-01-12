import './Contact.css';
import { MdLocalPhone } from "react-icons/md";
import { MdEmail } from "react-icons/md";
import { MdLocationOn } from "react-icons/md";

const Contact = () => {
    return (
        <div className="admin-contact-container">
            <div className="admin-contact-1">
                <h1 className="admin-contact-title">CONTACT US</h1>
                <div className="admin-contact-boxes"> 
                    <div className="admin-contact-box">
                        <MdLocationOn size={40}/>
                        <p className="admin-contact-box-header">
                            ADDRESS
                        </p>

                        <p className="admin-contact-box-info">
                            MyStreet St. No.1
                        </p>

                        <p className="admin-contact-box-info">
                            34000 Istanbul Turkey
                        </p>
                    </div>

                    <div className="admin-contact-box">
                        <MdLocalPhone size={40}/>
                        <p className="admin-contact-box-header">
                            PHONE NUMBERS
                        </p>

                        <p className="admin-contact-box-info">
                            Office: +90 123 1231212   
                        </p>

                        <p className="admin-contact-box-info">
                            Mobile: +90 456 4564545
                        </p>
                    </div>

                    <div className="admin-contact-box">
                        <MdEmail size={40}/>
                        <p className="admin-contact-box-header">
                            EMAIL
                        </p>

                        <p className="admin-contact-box-info">
                            contact@compresso.com
                        </p>
                    </div>
                </div>
            </div>

            <div className="admin-contact-2">
                <h1 className="admin-contact-title">MESSAGE US</h1>

                <form className="admin-contact-message-form">
                    <div className="form-group">
                        <label htmlFor="name">Name</label>
                        <input type="text" id="name" name="name" placeholder="Your Name" required />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" name="email" placeholder="Your Email" required />
                    </div>

                    <div className="form-group">
                        <label htmlFor="message">Message</label>
                        <textarea id="message" name="message" rows="5" placeholder="Your Message" required></textarea>
                    </div>

                    <button type="submit" className="submit-button">Send Message</button>
                </form>
            </div>

        </div>
    );
};

export default Contact;
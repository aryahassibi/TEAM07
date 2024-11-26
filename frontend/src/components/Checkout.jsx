import { useState } from 'react'
import './Checkout.css'

const Checkout = () => {
    

    const [action, setAction] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    
    const [address, setAddress] = useState({
        firstname: "",
        lastname: "",
        address: "",
        city: "",
        zipcode: "",
        country: "",
        phonenumber:"",
      });
    
      const [payment, setPayment] = useState({
        cardHolderName: "",
        cardNumber: "",
        cardExpirationMonth: "",
        cardExpirationYear:"",
        cvv: "",
      });
    
      const handleInputChange = (e, setter) => {
        const { name, value } = e.target;
        setter((prev) => ({ ...prev, [name]: value }));
      };

    {/*state variables to manage form data, error messages, and action (checkout)*/}
   



    
    {/*switch to purchase complete screen*/}
    const completeLink = () => {
        setAction( ' complete' );
    };

    {/*perform validation checks*/}
    const validateForm = () => {
        if (
            !address.firstname || !address.lastname || !address.address || !address.city || !address.country || !address.zipcode ||
            !address.phonenumber || !address.nameoncard || !payment.cardnumber || !payment.expirationMonth || !payment.expirationYear || !payment.ccv
        ) {
            setErrorMessage('All fields are required.');
            return false;
        }

        setErrorMessage('');
        return true;
    };

    {/*handle payment logic*/}
    const handlePayment = (e) => {
        e.preventDefault();
    
        if (!validateForm()) {
            return;
        }

        completeLink();

        // alert('Processing payment...');
    
        // setTimeout(() => {
        //     alert('Payment Successful! Thank you for your purchase.');
            
            
        //     setFirstname('');
        //     setLastname('');
        //     setAddress('');
        //     setCity('');
        //     setCountry('');
        //     setZipcode('');
        //     setPhonenumber('');
        //     setNameoncard('');
        //     setCardnumber('');
        //     setExpirationMonth('');
        //     setExpirationYear('');
        //     setCcv('');
        // }, 2000); 
    };

    return (
    <div className={`wrapper${action}`}>
        
        {/*checkout form*/}
        <div className="form-box checkout">
            <form action="">

                <h1>Checkout</h1>
                <h2>Shipping Information</h2>

                <div className="double-input-box">
                    <div className="column1">
                        <label htmlFor="firstname">First Name</label>
                        <input type="text" placeholder='First Name' 
                        value={address.firstname}
                        onChange={(e) => handleInputChange(e,setAddress)}
                        required/>
                    </div>
                    <div className="column2">
                        <label htmlFor="lastname">Last Name</label>
                        <input type="text" placeholder='Last Name' 
                        value={address.lastname}
                        onChange={(e) => handleInputChange(e,setAddress)}
                        required/>
                    </div>
                </div>

                <div className="single-input-box">
                    <label htmlFor="address">Address</label>
                    <input type="text" placeholder='Address' 
                    value={address.address}
                    onChange={(e) => handleInputChange(e,setAddress)}
                    required/>
                </div>

                <div className="double-input-box">
                    <div className="column1">
                        <label htmlFor="city">City</label>
                        <input type="text" placeholder='City' 
                        value={address.city}
                        onChange={(e) => handleInputChange(e,setAddress)}
                        required/>
                    </div>
                    <div className="column2">
                        <label htmlFor="country">Country</label>
                        <input type="text" placeholder='Country' 
                        value={address.country}
                        onChange={(e) => handleInputChange(e,setAddress)}
                        required/>
                    </div>
                </div>

                <div className="double-input-box">
                    <div className="column1">
                        <label htmlFor="zipcode">Zip Code</label>
                        <input type="text" placeholder='Zip Code' 
                        value={address.zipcode}
                        onChange={(e) => handleInputChange(e,setAddress)}
                        required/>
                    </div>
                    <div className="column2">
                        <label htmlFor="phonenumber">Phone Number</label>
                        <input type="text" placeholder='Phone Number' 
                        value={address.phonenumber}
                        onChange={(e) => handleInputChange(e,setAddress)}
                        required/>
                    </div>
                </div>

                <h2>Payment Information</h2>

                <div className="single-input-box">
                    <label htmlFor="nameoncard">Name on Card</label>
                    <input type="text" placeholder='Name' 
                    value={payment.cardHolderName}
                    onChange={(e) => handleInputChange(e, setPayment)}
                    required/>
                </div>

                <div className="single-input-box">
                    <label htmlFor="cardnumber">Card Number</label>
                    <input type="text" placeholder='Card Number' 
                    value={payment.cardNumber}
                    onChange={(e) => handleInputChange(e, setPayment)}
                    required/>
                </div>

                <div className="single-label">
                    <label htmlFor="expirationdate">Expiration Date</label>
                </div>
                <div className="double-input-box">
                    <div className="column1">
                        <input type="text" placeholder='Month' 
                        value={payment.cardExpirationMonth}
                        onChange={(e) => handleInputChange(e, setPayment)}
                        required/>
                    </div>
                    <div className="column2">
                        <input type="text" placeholder='Year' 
                        value={payment.cardExpirationYear}
                        onChange={(e) => handleInputChange(e, setPayment)}
                        required/>
                    </div>
                </div>

                <div className="single-input-box">
                    <label htmlFor="ccv">CCV</label>
                    <input type="text" placeholder='CCV' 
                    value={payment.cvv}
                    onChange={(e) => handleInputChange(e, setPayment)}
                    required/>
                </div>
                
                {errorMessage && <p style={{ color: 'red', fontWeight: 'bold'}}>{errorMessage}</p>}

                <button type="submit" onClick={handlePayment}>Pay Now</button>
            </form>
        </div>

        {/*purchase complete screen*/}
        <div className="form-box complete">
            <div className="action">
                <h1>Thank you for your purchase</h1>
                <a href="index.html" className="home-button">Return to Home Page</a> {/*make this button return to home screen*/}
            </div>
        </div>
    </div>


  )
}

export default Checkout
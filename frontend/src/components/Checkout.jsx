import { useState } from 'react'
import './Checkout.css'
import { useNavigate } from "react-router-dom";

const Checkout = () => {
    
    const totalPrice = 154
    const cartItems = [
        {
          name: "Brazil Coffee Beans",
          quantity: 2,
          price: 19.99,
          image: "/product1.jpg"
        },
        {
          name: "Colombian Coffee Beans",
          quantity: 1,
          price: 29.99,
          image: "/product2.jpg"
        },
        {
          name: "Arabica Coffee Beans",
          quantity: 3,
          price: 15.49,
          image: "/product3.jpg"
        }
      ];

    const navigate = useNavigate();
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
        ccv: "",
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
            !address.firstname || !address.lastname || !address.address || !address.city || !address.country || !address.zipcode 
           || !address.phonenumber || !payment.cardNumber || !payment.cardHolderName || !payment.cardExpirationMonth || !payment.cardExpirationYear || !payment.ccv
            
        ) {
            setErrorMessage('All fields are required.');
            console.log(payment.cardExpirationYear);
            return false;
        }
        console.log("hyoooka");
        setErrorMessage('');
        return true;
    };

    {/*handle payment logic*/}
    const handlePayment = (e) => {
        e.preventDefault();
    
        if (!validateForm()) {
            navigate("/order-failed");
        }
      else{  navigate("/order-success", { state: { orderId: 1907 } });}
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
                        name = "firstname"
                        value={address.firstname}
                        onChange={(e) => handleInputChange(e,setAddress)}
                        required/>
                    </div>
                    <div className="column2">
                        <label htmlFor="lastname">Last Name</label>
                        <input type="text" placeholder='Last Name' 
                        name = "lastname"
                        value={address.lastname}
                        onChange={(e) => handleInputChange(e,setAddress)}
                        required/>
                    </div>
                </div>

                <div className="single-input-box">
                    <label htmlFor="address">Address</label>
                    <input type="text" placeholder='Address' 
                    name = "address"
                    value={address.address}
                    onChange={(e) => handleInputChange(e,setAddress)}
                    required/>
                </div>

                <div className="double-input-box">
                    <div className="column1">
                        <label htmlFor="city">City</label>
                        <input type="text" placeholder='City' 
                        name = "city"
                        value={address.city}
                        onChange={(e) => handleInputChange(e,setAddress)}
                        required/>
                    </div>
                    <div className="column2">
                        <label htmlFor="country">Country</label>
                        <input type="text" placeholder='Country' 
                        name = "country"
                        value={address.country}
                        onChange={(e) => handleInputChange(e,setAddress)}
                        required/>
                    </div>
                </div>

                <div className="double-input-box">
                    <div className="column1">
                        <label htmlFor="zipcode">Zip Code</label>
                        <input type="text" placeholder='Zip Code' 
                        name = "zipcode"
                        value={address.zipcode}
                        onChange={(e) => handleInputChange(e,setAddress)}
                        required/>
                    </div>
                    <div className="column2">
                        <label htmlFor="phonenumber">Phone Number</label>
                        <input type="text" placeholder='Phone Number' 
                        name= "phonenumber"
                        value={address.phonenumber}
                        onChange={(e) => handleInputChange(e,setAddress)}
                        required/>
                    </div>
                </div>

                <h2>Payment Information</h2>

                <div className="single-input-box">
                    <label htmlFor="nameoncard">Name on Card</label>
                    <input type="text" placeholder='Name' 
                    name = "cardHolderName"
                    value={payment.cardHolderName}
                    onChange={(e) => handleInputChange(e, setPayment)}
                    required/>
                </div>

                <div className="single-input-box">
                    <label htmlFor="cardnumber">Card Number</label>
                    <input type="text" placeholder='Card Number' 
                    name = "cardNumber"
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
                        name = "cardExpirationMonth"
                        value={payment.cardExpirationMonth}
                        onChange={(e) => handleInputChange(e, setPayment)}
                        required/>
                    </div>
                    <div className="column2">
                        <input type="text" placeholder='Year' 
                        name = "cardExpirationYear"
                        value={payment.cardExpirationYear}
                        onChange={(e) => handleInputChange(e, setPayment)}
                        required/>
                    </div>
                </div>

                <div className="single-input-box">
                    <label htmlFor="ccv">CCV</label>
                    <input type="text" placeholder='CCV' 
                    name = "ccv"
                    value={payment.ccv}
                    onChange={(e) => handleInputChange(e, setPayment)}
                    required/>
                </div>
                
                {errorMessage && <p style={{ color: 'red', fontWeight: 'bold'}}>{errorMessage}</p>}

                <button type="submit" onClick={handlePayment}>Pay Now</button>
            </form>
      
        </div>

        <div className="checkout-right">
            <h2>Order Summary</h2>
            <ul className="cart-items">
            {cartItems.map((item, index) => (
            <li key={index} className="cart-item">
                <div className="item-image">
                    <img src={item.image} alt={item.name} />
                </div>
                <div className="item-details">
                <span className="item-name">{item.name}</span>
                <span className="item-quantity">x{item.quantity}</span>
                </div>
                <div className="item-price">${item.price.toFixed(2)}</div>
            </li>
            ))}
        </ul>
        <div className="total-price">
            <h3>Total: ${totalPrice.toFixed(2)}</h3>
        </div>
        </div>

        {/*purchase complete screen*/}
        

        


    </div>


  )
}

export default Checkout



// <div className="form-box complete">
//             <div className="action">
//                 <h1>Thank you for your purchase</h1>
//                 <a href="index.html" className="home-button">Return to Home Page</a> {/*make this button return to home screen*/}
//             </div>
//         </div>
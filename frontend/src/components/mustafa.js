import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./CheckoutPage.css";

const CheckoutPage = () => {
  const location = useLocation(); // Retrieve data passed from the previous page
  const navigate = useNavigate();

  const { cartItems, totalPrice } = location.state || {
    cartItems: [],
    totalPrice: 0,
  };

  const [address, setAddress] = useState({
    firstname: "",
    lastname: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });

  const [payment, setPayment] = useState({
    cardHolderName: "",
    cardNumber: "",
    cardExpiration: "",
    cvv: "",
  });

  const handleInputChange = (e, setter) => {
    const { name, value } = e.target;
    setter((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckout = async () => {
    try {
      const checkoutData = {
        address,
        cardDetails: payment,
        cartItems,
        totalPrice,
      };

      const response = await axios.post("/api/checkout", checkoutData);

      if (response.status === 200) {
        // alert("Checkout successful!");
        navigate("/order-success", { state: { orderId: response.data.orderId } });
      }

      else if (response.status === 402) {
        // alert("Checkout successful!");    // is this a problem
        navigate("/order-failed" );
      }

    } catch (error) {
      console.error("Checkout failed", error);
      alert(`Checkout failed: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className="checkout-page">
      <div className="checkout-left">
        <h2>Shipping Address</h2>
        <div className="form-group">
          <label>Address Line</label>
          <input
            type="text"
            name="addressLine"
            value={address.addressLine}
            onChange={(e) => handleInputChange(e, setAddress)}
          />
        </div>
        <div className="form-group">
          <label>City</label>
          <input
            type="text"
            name="city"
            value={address.city}
            onChange={(e) => handleInputChange(e, setAddress)}
          />
        </div>
        <div className="form-group">
          <label>State</label>
          <input
            type="text"
            name="state"
            value={address.state}
            onChange={(e) => handleInputChange(e, setAddress)}
          />
        </div>
        <div className="form-group">
          <label>Postal Code</label>
          <input
            type="text"
            name="postalCode"
            value={address.postalCode}
            onChange={(e) => handleInputChange(e, setAddress)}
          />
        </div>
        <div className="form-group">
          <label>Country</label>
          <input
            type="text"
            name="country"
            value={address.country}
            onChange={(e) => handleInputChange(e, setAddress)}
          />
        </div>

        <h2>Payment Info</h2>
        <div className="form-group">
          <label>Card Holder Name</label>
          <input
            type="text"
            name="cardHolderName"
            value={payment.cardHolderName}
            onChange={(e) => handleInputChange(e, setPayment)}
          />
        </div>
        <div className="form-group">
          <label>Card Number</label>
          <input
            type="text"
            name="cardNumber"
            value={payment.cardNumber}
            onChange={(e) => handleInputChange(e, setPayment)}
          />
        </div>
        <div className="form-group">
          <label>Expiration Date</label>
          <input
            type="text"
            name="cardExpiration"
            placeholder="MM/YY"
            value={payment.cardExpiration}
            onChange={(e) => handleInputChange(e, setPayment)}
          />
        </div>
        <div className="form-group">
          <label>CVV</label>
          <input
            type="text"
            name="cvv"
            value={payment.cvv}
            onChange={(e) => handleInputChange(e, setPayment)}
          />
        </div>

        <button className="checkout-button" onClick={handleCheckout}>
          Complete Purchase
        </button>
      </div>

      <div className="checkout-right">
        <h2>Order Summary</h2>
        <ul className="cart-items">
          {cartItems.map((item, index) => (
            <li key={index} className="cart-item">
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
    </div>
  );
};

export default CheckoutPage;

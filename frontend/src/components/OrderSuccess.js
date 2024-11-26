
import { useLocation, useNavigate } from "react-router-dom";
import "./OrderStatus.css";
import successIcon from "../img/success.png"; // Add an appropriate success icon

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId } = location.state || {};

  const handleBackToHome = () => {
    navigate("/");
  };

  return (
    <div className="order-status-page">
      <div className="order-status-container">
        <img src={successIcon} alt="Success" className="status-icon" />
        <h1>Order Placed Successfully!</h1>
        <p>Your order ID is <strong>{orderId}</strong>.</p>
        <p>Thank you for shopping with us! You will receive a confirmation email shortly.</p>
        <button onClick={handleBackToHome} className="status-button">
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default OrderSuccess;

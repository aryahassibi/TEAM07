
import { useNavigate } from "react-router-dom";
import "./OrderStatus.css";
import errorIcon from "../assets/images/icons/error.png"; // Add an appropriate error icon

const Failed = () => {
  const navigate = useNavigate();

  const handleRetryCheckout = () => {
    navigate("/checkout");
  };

  const handleBackToHome = () => {
    navigate("/");
  };

  return (
    <div className="order-status-page">
      <div className="order-status-container">
        <img src={errorIcon} alt="Error" className="status-icon" />
        <h1>Order Failed</h1>
        <p>Unfortunately, your order could not be processed at this time.</p>
        <p>Please try again.</p>
        <div className="button-group">
          <button onClick={handleRetryCheckout} className="status-button retry-button">
            Retry Checkout
          </button>
          <button onClick={handleBackToHome} className="status-button home-button">
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default Failed;

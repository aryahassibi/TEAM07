// src/components/Card.js
import './Card.css';
import { useContext } from 'react';
import Navbar from './Navbar';
import { CartContext } from '../CartContext';

const Card = () => {
  const { cartItems } = useContext(CartContext);

  // Calculate total price for all items in the cart
  const totalCartPrice = cartItems.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);

  return (
    <div>
      <Navbar />
      <div style={{ padding: '20px' }}>
        <h2>Your Cart</h2>
        {cartItems.length > 0 ? (
          <ul>
            {cartItems.map((item, index) => (
              <li key={index} style={{ marginBottom: '15px' }}>
                <h3>{item.product}</h3>
                <p>Price per item: ${item.price}</p>
                <p>Quantity: {item.quantity}</p>
                <p>Total price for this item: ${item.price * item.quantity}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>Your cart is currently empty.</p>
        )}
        {cartItems.length > 0 && (
          <div>
            <h3>Total Cart Price: ${totalCartPrice}</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default Card;

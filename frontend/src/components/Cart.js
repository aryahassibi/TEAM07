import './Cart.css';
import { useState,useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPrice, setTotalPrice] = useState(0);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {

    

    if (token) {
      
      axios.get('http://localhost:5001/api/cart/getcartitems', {   
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => {
        setCart(response.data);  
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching cart data", error);
        setLoading(false);
      });
    } else {
      
      const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
      setCart(savedCart);
      setLoading(false);
    }
  }, [token]);  

  const calculateTotalPrice = () => {
    let total = 0;
    cart.forEach(item => {
      total += item.price * item.quantity; // Price * Quantity
    });
    setTotalPrice(total); 
  };


  useEffect(() => {
    if (cart.length > 0) {
      calculateTotalPrice();
    }
  }, [cart]); 

  

  
const handleIncrement = async (productId) => {
  try {
      // Fetch the current product details, including stock, from the backend
      const response = await axios.get(`http://localhost:5001/api/cart/variant/${productId}`);  // I need to change this
      const product = response.data;

      
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      const cartItem = cart.find(item => item.productId === productId);

      if (!cartItem) {
          console.error('Product not found in cart.');
          return;
      }

      
      if (cartItem.quantity + 1 > product.stock) {
          alert(`Cannot add more. Only ${product.stock} units available.`);
          return;
      }

      
      const updatedCart = cart.map(item =>
          item.productId === productId
              ? { ...item, quantity: item.quantity + 1 }
              : item
      );

      
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      setCart(updatedCart); // Update UI
  } catch (error) {
      console.error('Failed to increment product quantity:', error.response?.data || error.message);
      alert('Error updating the cart. Please try again.');
  }
};
  

  

  const handleIncrementQuantity = async (variantId) => {
    if (token) {
      // If logged in, increment quantity in the backend
      axios.put(`http://localhost:5001/api/cart/increment`, {variantId}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(() => {
        // Update cart UI with new quantity
        setCart(cart.map(item => 
          item.productId === variantId ? { ...item, quantity: item.quantity + 1 } : item
        ));
      })
      .catch((error) => {
        if (error.response && error.response.status === 400) {
          setError(error.response.data.error);  
        } else {
          setError("Error incrementing quantity. Please try again.");
        }
      });
    } else {
      
       handleIncrement(variantId)
    }
  };





  
  const handleDecrementQuantity =  async (variantId) => {
    if (token) {
      
      axios.put(`http://localhost:5001/api/cart/decrement`, {variantId}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(() => {
        
        setCart(cart.map(item => 
          item.productId === variantId && item.quantity > 1 
            ? { ...item, quantity: item.quantity - 1 }
            : item
        ));
      })
      .catch(() => {
        console.error("Error decrementing item quantity", error);
      });
    } else {
      
      const updatedCart = cart.map(item => 
        item.productId === variantId && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      );
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      setCart(updatedCart);  
    }
  };

 



  const handleRemoveFromCart = async (variantId) => {
    if (token) {
      
      axios.delete(`http://localhost:5001/api/cart/remove`, { data: { variantId } }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(() => {
        setCart(cart.filter(item => item.variantId !== variantId));
      })
      .catch(error => {
        console.error("Error removing item from cart", error);
      });
    } else {
      
      const updatedCart = cart.filter(item => item.variantId !== variantId); 
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      setCart(updatedCart); 
    }
  };
  


  const handleCheckout = () => {
    if (!token) {
      
      navigate("/login");
    } else {
      if (cart.length === 0) {
        
        alert("Your cart is empty. Please add items to your cart before proceeding to checkout.");
        return; 
      }}
    
      
      navigate("/checkout", { state: { totalPrice, cart } });
  };

  const loadingStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    fontSize: '2rem',
    color: '#4CAF50', 
    fontWeight: 'bold',
    backgroundColor: '#f3f3f3', 
  };

  if (loading) {
    return <div style={loadingStyle}>Loading...</div>;
  }




  return (
    <div className="cart-page-container">
      <div className="cart-page-content">
        <div className="cart-page-list-section">
          <h1>Your Cart</h1>
          <ul className="cart-page-list">
            {cart.map((item, index) => (
              <li key={index} className="cart-page-item">
                <img src={item.image} alt={item.product_name} className="cart-page-item-image" />
                <div className="cart-page-item-details">
                  <h3>{item.product_name}</h3>
                  <p>Price per item: ${item.price}</p>
                  <div className="cart-page-actions">
                    <button
                      className="cart-page-button cart-page-button-primary"
                      onClick={() => handleDecrementQuantity(item.variantId)}
                    >
                      -
                    </button>
                    <span className="cart-page-item-quantity">Quantity: {item.quantity}</span>
                    <button
                      className="cart-page-button cart-page-button-primary"
                      onClick={() => handleIncrementQuantity(item.variantId)}
                    >
                      +
                    </button>
                  </div>
                  <p>Total: ${(item.price * item.quantity).toFixed(2)}</p>
                  <button
                    className="cart-page-button cart-page-button-danger cart-page-remove-button"
                    onClick={() => handleRemoveFromCart(item.variantId)}
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="cart-page-checkout-section">
          <div className="cart-page-checkout-summary">
            <h3>Total: ${totalPrice.toFixed(2)}</h3>
            <button
              onClick={handleCheckout}
              className="cart-page-button cart-page-button-checkout"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Cart;

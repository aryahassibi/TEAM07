// controllers/checkoutController.js
const pool = require('../models/db');

const validateCart = async (req, res) => {
    const userId = req.user.id;
  
    try {
      const connection = await pool.getConnection();
  
      // Retrieve cart items
      const [cartItems] = await connection.query(
        `SELECT sci.variant_id, sci.quantity, p.stock, p.price
         FROM ShoppingCartItems sci
         JOIN  Product_Variant p ON sci.variant_id = p.product_id
         WHERE sci.cart_id = (SELECT cart_id FROM ShoppingCart WHERE user_id = ?)`,
        [userId]
      );
  
      if (!cartItems.length) {
        return res.status(400).json({ message: 'Cart is empty' });
      }
  
      
      let totalPrice = 0;
      const unavailableItems = [];
      for (const item of cartItems) {
        if (item.quantity > item.stock) {
          unavailableItems.push({ variantId: item.variant_id, stock: item.stock });
        } else {
          totalPrice += item.price * item.quantity;
        }
      }
  
      if (unavailableItems.length > 0) {
        return res.status(400).json({
          message: 'Some items are out of stock',
          unavailableItems
        });
      }
  
      res.status(200).json({
        message: 'Stock validated successfully',
        cartItems,
        totalPrice
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  

  

  // controllers/checkoutController.js
const finalizeCheckout = async (req, res) => {
    const userId = req.user.id;
    const { address, cardDetails, cartItems, totalPrice } = req.body; // cartItems and totalPrice come from the frontend
  
    const connection = await pool.getConnection();
    try {
      // Start transaction
      await connection.beginTransaction();
  
      // Validate request body
      if (!address || !cardDetails || !cartItems || !totalPrice) {
        return res.status(400).json({ message: 'Address, payment details, and cart information are required' });
      }
  
      // Simulate payment
      const paymentSuccess = Math.random() > 0.2; // 80% chance of success
      if (!paymentSuccess) {
      await connection.rollback();
      return res.status(402).json({ message: 'Payment processing failed. Please try again.' });
      }
  
      // Create order
      const [orderResult] = await connection.query(
        `INSERT INTO Orders (user_id, total_price, status) VALUES (?, ?, ?)`,
        [userId, totalPrice, 'processing']
      );
  
      const orderId = orderResult.insertId;
  
      // Add items to OrderItems and deduct stock
      for (const item of cartItems) {
        await connection.query(
          `INSERT INTO OrderItems (order_id, product_id, quantity, price_at_purchase) VALUES (?, ?, ?, ?)`,
          [orderId, item.variant_id, item.quantity, item.price]
        );
  
        await connection.query(
          `UPDATE Products SET stock = stock - ? WHERE product_id = ?`,
          [item.quantity, item.variant_id]
        );
      }
  
      // Create payment record
      await connection.query(
        `INSERT INTO Payments (order_id, user_id, amount, card_holder_name, card_number, card_expiration, cvv)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          orderId,
          userId,
          totalPrice,
          cardDetails.cardHolderName,
          cardDetails.cardNumber,
          cardDetails.cardExpiration,
          cardDetails.cvv
        ]
      );
  
      // Clear user's cart
      await connection.query(
        `DELETE FROM ShoppingCartItems WHERE cart_id = (SELECT cart_id FROM ShoppingCart WHERE user_id = ?)`,
        [userId]
      );
  
      // Commit transaction
      await connection.commit();
  
      res.status(200).json({
        message: 'Checkout successful',
        orderId,
        paymentStatus: 'success',
        estimatedDelivery: '3-5 business days'
      });
    } catch (error) {
      await connection.rollback();
      res.status(500).json({ message: error.message });
    } finally {
      connection.release();
    }
  };
  
  module.exports = { validateCart, finalizeCheckout };
  
const mysql = require("mysql2");

// Database connection
const db = require('../config/db');
exports.getItems=(req, res) => {      
    const userId = req.user.user_id; 
  
    const query = `
      SELECT 
        p.name AS product_name,
        pv.variant_id AS variantId,
        ci.quantity,
        pv.price,
        pv.weight_grams AS weight,
        pi.image_url AS image
      FROM ShoppingCart sc
      JOIN ShoppingCartItems ci ON ci.cart_id = sc.cart_id
      JOIN Product_Variant pv ON pv.variant_id = ci.variant_id
      JOIN Products p ON p.product_id = pv.product_id
      LEFT JOIN Product_Images pi ON pi.product_id = p.product_id
      WHERE sc.user_id = ? AND pi.image_id = (
        SELECT MIN(image_id) FROM Product_Images WHERE product_id = p.product_id
      )
    `;
  
    router.execute(query, [userId], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Database error' });
      }
  
      res.json(results);
    });
  }



exports.incrementItem = (variantId, userId, res) => {   
    
    const query = `
      SELECT stock FROM Product_Variant WHERE variant_id = ?
    `;
    
    db.execute(query, [variantId], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Database error' });
      }
  
      if (results.length === 0) {
        return res.status(404).json({ message: 'Variant not found' });
      }
  
      const stock = results[0].stock;
  
      // Check if there is enough stock
      const cartQuery = `
        SELECT quantity FROM ShoppingCartItems 
        WHERE cart_id IN (SELECT cart_id FROM ShoppingCart WHERE user_id = ?) 
        AND variant_id = ?
      `;
  
      db.execute(cartQuery, [userId, variantId], (err, cartResults) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: 'Database error' });
        }
  
        if (cartResults.length === 0) {
          return res.status(404).json({ message: 'Item not in cart' });
        }
  
        const currentQuantity = cartResults[0].quantity;
        const newQuantity = currentQuantity + 1;
  
        // Check if stock is sufficient
        if (newQuantity > stock) {
          return res.status(400).json({ message: 'Insufficient stock' });
        }
  
        // Increment quantity in the cart
        const updateQuery = `
          UPDATE ShoppingCartItems SET quantity = ? 
          WHERE cart_id IN (SELECT cart_id FROM ShoppingCart WHERE user_id = ?) 
          AND variant_id = ?
        `;
  
        db.execute(updateQuery, [newQuantity, userId, variantId], (err, updateResult) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Failed to update quantity' });
          }
  
          res.json({ message: 'Item quantity updated successfully' });
        });
      });
    });
  };


  exports.decrementItem = (variantId, userId, res) => {  //checked and no problem
    const query = `
      SELECT quantity FROM ShoppingCartItems 
      WHERE cart_id IN (SELECT cart_id FROM ShoppingCart WHERE user_id = ?) 
      AND variant_id = ?
    `;
  
    db.execute(query, [userId, variantId], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Database error' });
      }
  
      if (results.length === 0) {
        return res.status(404).json({ message: 'Item not in cart' });
      }
  
      const currentQuantity = results[0].quantity;
  
      // Ensure quantity doesn't go below 1
      if (currentQuantity <= 1) {
        return res.status(400).json({ message: 'Quantity cannot be less than 1' });
      }
  
      const newQuantity = currentQuantity - 1;
  
      const updateQuery = `
        UPDATE ShoppingCartItems SET quantity = ? 
        WHERE cart_id IN (SELECT cart_id FROM ShoppingCart WHERE user_id = ?) 
        AND variant_id = ?
      `;
  
      db.execute(updateQuery, [newQuantity, userId, variantId], (err, updateResult) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: 'Failed to update quantity' });
        }
  
        res.json({ message: 'Item quantity updated successfully' });
      });
    });
  };


exports.removeItem = (variantId, userId, res) => {   //checked no problem
    const query = `
      DELETE FROM ShoppingCartItems 
      WHERE cart_id IN (SELECT cart_id FROM ShoppingCart WHERE user_id = ?) 
      AND variant_id = ?
    `;
  
    db.execute(query, [userId, variantId], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Database error' });
      }
  
      if (results.affectedRows === 0) {
        return res.status(404).json({ message: 'Item not found in cart' });
      }
  
      res.json({ message: 'Item removed from cart' });
    });
  };



exports.addToCart = (req, res) => {
    const userId = req.user.user_id; // Extract user ID from the authentication token
    const { variantId } = req.body;
  
    // Step 1: Get the user's ShoppingCart ID
    const getCartQuery = 'SELECT cart_id FROM ShoppingCart WHERE user_id = ?';
  
    db.execute(getCartQuery, [userId], (err, cartResults) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Database error' });
      }
  
      if (cartResults.length === 0) {
        return res.status(404).json({ message: 'Shopping cart not found' });
      }
  
      const cartId = cartResults[0].cart_id;
  
      
      const checkItemInCartQuery = `
        SELECT quantity FROM ShoppingCartItems 
        WHERE cart_id = ? AND variant_id = ?
      `;
      
      db.execute(checkItemInCartQuery, [cartId, variantId], (err, itemResults) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: 'Database error' });
        }
  
        // If item exists in cart, check stock and increment the quantity
        if (itemResults.length > 0) {
          const currentQuantity = itemResults[0].quantity;
          checkStockAndUpdateCart(variantId, currentQuantity + 1, cartId, res);
        } else {
          // If item does not exist in cart, add it with quantity 1
          checkStockAndAddItem(variantId, cartId, res);
        }
      });
    });
  }


exports.checkStockAndUpdateCart = (variantId, newQuantity, cartId, res) => {
    const stockQuery = 'SELECT stock FROM Product_Variant WHERE variant_id = ?';
    db.execute(stockQuery, [variantId], (err, stockResults) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Database error' });
      }
  
      if (stockResults.length === 0) {
        return res.status(404).json({ message: 'Variant not found' });
      }
  
      const stock = stockResults[0].stock;
  
      if (newQuantity > stock) {
        return res.status(400).json({ message: 'Insufficient stock' });
      }
  
      // Update quantity in the cart
      const updateQuery = `
        UPDATE ShoppingCartItems 
        SET quantity = ? 
        WHERE cart_id = ? AND variant_id = ?
      `;
  
      db.execute(updateQuery, [newQuantity, cartId, variantId], (err, updateResult) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: 'Failed to update cart item' });
        }
  
        res.status(200).json({ message: 'Item quantity updated successfully' });
      });
    });
  };



exports.checkStockAndAddItem = (variantId, cartId, res) => {
    const stockQuery = 'SELECT stock FROM Product_Variant WHERE variant_id = ?';
    db.execute(stockQuery, [variantId], (err, stockResults) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Database error' });
      }
  
      if (stockResults.length === 0) {
        return res.status(404).json({ message: 'Variant not found' });
      }
  
      const stock = stockResults[0].stock;
  
      if (stock <= 0) {
        return res.status(400).json({ message: 'Insufficient stock' });
      }
  
      // Add the item with quantity 1
      const addItemQuery = `
        INSERT INTO ShoppingCartItems (cart_id, variant_id, quantity) 
        VALUES (?, ?, ?)
      `;
  
      db.execute(addItemQuery, [cartId, variantId, 1], (err, addItemResult) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: 'Error adding item to cart' });
        }
  
        res.status(200).json({ message: 'Item added to cart successfully' });
      });
    });
  };




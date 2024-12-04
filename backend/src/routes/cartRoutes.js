const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const authMiddleware = require('../middleware/authMiddleware');
const db = require('../config/db');

router.get('/getcartitems', authMiddleware, cartController.getItems);


router.put('/increment', authMiddleware, (req, res) => {
    const { variantId } = req.body;
    const userId = req.user.user_id; 
    cartController.incrementItem(variantId, userId, res);
  });
  
router.put('/decrement', authMiddleware, (req, res) => {
    const { variantId } = req.body;
    const userId = req.user.user_id;
    cartController.decrementItem(variantId, userId, res);
  });
  
router.delete('/remove', authMiddleware, (req, res) => {
    const { variantId } = req.body;
    const userId = req.user.user_id;
    cartController.removeItem(variantId, userId, res);
  });


router.post('/add-to-cart', authMiddleware, cartController.addToCart );

// router.post('/checkout', cartController.checkoutCart);


router.get('/variant/:variantId', async (req, res) => {
  const { variantId } = req.params;

  try {
      const [rows] = await db.query(
          `SELECT 
              p.name AS product_name,
              pv.variant_id AS variantId,
              pv.stock,
              pv.price,
              pv.weight_grams AS weight,
              pi.image_url AS image
          FROM Products AS p
          INNER JOIN Product_Variant AS pv ON p.product_id = pv.product_id
          LEFT JOIN Product_Images AS pi ON p.product_id = pi.product_id
          WHERE pv.variant_id = ?
          LIMIT 1`,
          [variantId]
      );

      if (rows.length === 0) {
          return res.status(404).json({ error: 'Product variant not found' });
      }

      res.json(rows[0]);
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
  }
});




module.exports = router;

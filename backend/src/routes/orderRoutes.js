const express = require('express');
const orderController = require('../controllers/orderController');
const {authMiddleware} = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/getorders', authMiddleware, orderController.getOrders);

router.get('/getallorders', authMiddleware, orderController.getAllOrders);

router.get('/getinvoice/:orderId', authMiddleware ,orderController.getInvoice);

router.put('/cancel/:orderId', authMiddleware ,orderController.cancelOrder);

router.get('/getrefunds' ,authMiddleware, orderController.getRefunds);

router.post('/refund-request',authMiddleware ,orderController.createRefund);

router.post('/refund/:id/approve',authMiddleware ,orderController.approveRefund );

router.post('/refund/:id/reject',authMiddleware ,orderController.rejectRefund );


module.exports = router;
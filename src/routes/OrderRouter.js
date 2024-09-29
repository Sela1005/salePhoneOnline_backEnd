const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/OrderController')
const {authUserMiddleware, authMiddleware} = require("../middleware/authMiddleware")

router.post('/create', OrderController.createOrder)

router.get('/get-order-details/:id',authUserMiddleware, OrderController.getDetailOrder)

router.get('/get-all-order',authMiddleware, OrderController.getAllOrder)

router.put('/update/:id',authMiddleware, OrderController.updateOrder)

module.exports = router
const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/ProductController')
const { authMiddleware} = require('../middleware/authMiddleware');

router.post('/create', ProductController.createProduct)
router.put('/update/:id',authMiddleware, ProductController.updateProduct)
router.get('/get-details/:id', ProductController.getDetailProduct)
router.delete('/delete/:id',authMiddleware, ProductController.deleteProduct)
router.get('/get-all', ProductController.getAllProduct)
router.delete('/delete-many', ProductController.deleteMany)
router.get('/get-all-type', ProductController.getAllType)
router.get('/products-by-price', ProductController.getProductsByPriceRange)



module.exports = router

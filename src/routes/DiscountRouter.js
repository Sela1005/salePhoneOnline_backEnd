// router
const express = require('express');
const DiscountController = require('../controllers/DiscountController');
const { authMiddleware,authUserMiddleware } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/create', authUserMiddleware, DiscountController.createDiscountCode); // Chỉ admin nên thêm authUserMiddleware nếu cần
router.get('/get-all', DiscountController.getAllDiscountCodes); // Không cần auth để xem danh sách
router.get('/get-detail/:code', DiscountController.getDiscountCode); // Không cần auth để xem chi tiết
router.put('/update/:code', authMiddleware, DiscountController.updateDiscountCode);
router.delete('/delete/:code', authMiddleware, DiscountController.deleteDiscountCode);
router.post('/use/:code', authMiddleware, DiscountController.useDiscountCode);
router.post('/undo', authMiddleware, DiscountController.undoDiscountCode);
router.post('/redo', authMiddleware, DiscountController.redoDiscountCode);

module.exports = router;
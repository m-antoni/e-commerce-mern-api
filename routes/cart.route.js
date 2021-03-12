const express = require('express');
const router = express.Router();
const { auth } = require('../middlewares/auth.middleware');
const CartController = require('../controllers/cart.controller');

// URL: api/carts
router.get('/', auth, CartController.userCart);
router.post('/', auth, CartController.addToCart);
router.post('/store', auth, CartController.storeCart);
router.put('/:product_id', auth, CartController.updateCart);
router.delete('/:product_id', auth, CartController.removeFromCart);

module.exports = router;
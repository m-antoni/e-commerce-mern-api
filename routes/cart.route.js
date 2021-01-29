const express = require('express');
const router = express.Router();
const { auth } = require('../middlewares/auth.middleware');
const CartController = require('../controllers/cart.controller');

/*  URL: api/carts/ */
router.post('/', auth, CartController.addToCart);




module.exports = router;
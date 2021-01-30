const express = require('express');
const router = express.Router();
const { auth } = require('../middlewares/auth.middleware');
const ShippingController = require('../controllers/shipping.controller');

// URL: api/shipping

router.post('/', auth, ShippingController.addShipping);





module.exports = router;
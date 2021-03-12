const express = require('express');
const router = express.Router();
const { auth } = require('../middlewares/auth.middleware');
const ShippingController = require('../controllers/shipping.controller');

// URL: api/shipping

router.get('/', auth, ShippingController.userShipping);
router.post('/', auth, ShippingController.addShipping);
router.put('/:detail_id', auth, ShippingController.updateShipping);
router.delete('/:detail_id', auth, ShippingController.removeDetail);
router.put('/default/:detail_id', auth, ShippingController.updateDefault);

module.exports = router;
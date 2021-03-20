const express = require('express');
const router = express.Router();
const FakeStoreController = require('../controllers/fakestore.controller');

// URL: api/shipping

router.get('/', FakeStoreController.getFakeStore);

module.exports = router;
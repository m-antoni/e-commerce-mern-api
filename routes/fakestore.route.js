const express = require('express');
const router = express.Router();
const cors = require('cors');
const FakeStoreController = require('../controllers/fakestore.controller');

// URL: api/shipping

router.get('/', cors(), FakeStoreController.getFakeStore);

module.exports = router;
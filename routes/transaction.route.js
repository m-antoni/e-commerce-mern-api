const express = require('express');
const router = express.Router();
const { auth } = require('../middlewares/auth.middleware');
const TransactionController = require('../controllers/transaction.controller');

// URL: api/transaction
router.get('/', auth, TransactionController.getTransaction);
router.post('/', auth, TransactionController.addTransaction);
router.get('/:id', auth, TransactionController.singleTransaction);
router.delete('/id', auth, TransactionController.removeTransaction);

module.exports = router;
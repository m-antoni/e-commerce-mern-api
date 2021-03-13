const Transaction = require('../models/Transaction');

/* 
    @route   GET api/transaction
    @desc    Get all Transaction
    @access  private 
*/
const getTransaction = async (req, res) => {
    
    try {
        
        const transactions = await Transaction.find({ user_id: req.authID }).select('-user_id');

        res.json({transactions});

    } catch (err) {
        console.log(err);
        res.status(500).send('Server Error.')
    }
}

/* 
    @route   GET api/transaction/:id
    @desc    Get Single Transaction
    @access  private 
*/
const singleTransaction = async (req, res) => {
    
    const trans_id = req.params.id;

    try {

        const transaction = await Transaction.findById(trans_id);
        
        res.json({ transaction });

    } catch (err) {
        console.log(err);
        res.status(500).send('Server Error.')
    }
}


/* 
    @route   POST api/transaction
    @desc    Add Transaction
    @access  private 
*/
const addTransaction = async (req, res) => {

    const { transaction_code, payment_type, shipping_details, items, amount } = req.body;
    const authID = req.authID;
    
    try {
        
        const insertData = {
            user_id: authID,
            transaction_code,
            payment_type,
            shipping_details,
            items,
            amount
        };

        const transaction = new Transaction(insertData);
        await  transaction.save();

        res.json({ transaction, message: 'transaction success' });

    } catch (err) {
        console.log(err);
        res.status(500).send('Server Error.')
    }
}


/* 
    @route   DELETE api/transaction/:id
    @desc    DELETE Transaction
    @access  private 
*/
const removeTransaction = async (req, res) => {

    try {
        
        const transactions = await Transaction.findByIdAndDelete(req.params.id);
        res.json({ transactions });

    } catch (err) {
        console.log(err);
        res.status(500).send('Server Error.')
    }
}


module.exports = { getTransaction, addTransaction, singleTransaction, removeTransaction };

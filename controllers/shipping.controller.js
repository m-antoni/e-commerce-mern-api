const Shipping = require('../models/Shipping');

/* 
    @route   GET api/shipping
    @desc    Add Shiping
    @access  private 
*/
const addShipping = async (req, res) => {
    
    const { address, zipcode, contact } = req.body.dispatch;


    res.json(req.body.dispatch)
    
}




module.exports = { addShipping }; 
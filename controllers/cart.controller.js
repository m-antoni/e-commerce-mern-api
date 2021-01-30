const Cart = require('../models/Cart');

/* 
    @route   GET api/carts
    @desc    Get all uses's item from Cart
    @access  private 
*/
const userCart = async (req, res) => {
    
    try {
        const cart = await Cart.findOne({ user_id: req.authID }).select('-user_id');

        res.json(cart);

    } catch (err) {
        console.log(err);
        res.status(500).send('Server Error.');
    }
    
}

/* 
    @route   POST api/carts
    @desc    Add to Cart
    @access  private 
*/
const addToCart = async (req, res) => {

    const { products } = req.body;
    const errors = [];

    try {
        
        let cart = await Cart.findOne({ user_id: req.authID });
        
        // check if user has cart data
        if(cart){
            
            let checkProduct = cart.products.filter(item => item.product_id === products.product_id);

            // check if product is already in the array
            if(checkProduct.length > 0){
                errors.push({ message: 'Product is already in the cart' })
                return res.status(400).json(errors);
            }
            
            cart.products.push(products);
            await cart.save();
        
        }else{

            // Create new cart
            let formParams = {
                user_id: req.authID,
                products
            }

            cart = new Cart(formParams);
            await cart.save();
        }

        res.json(cart);

    } catch (err) {
        console.log(err);
        res.status(500).send('Server Error.');
    }

}


/* 
    @route   PUT api/carts/:product_id
    @desc    Update Cart
    @access  private 
*/
const updateCart = async (req, res) => {

    const qty = req.body.qty;
    const product_id = req.params.product_id

    try{

        const  cart = await Cart.findOne({ user_id: req.authID });

        // Update items in array
        cart.products.map(item => {
            if(item.product_id === product_id)
            {
                item.qty = qty;
            }
        });
    
        await cart.save();

        res.json(cart);

    }catch(err){
        console.log(err);
        res.status(500).send('Server Error.');
        
    }
}


/* 
    @route   DELETE api/carts/:product_id
    @desc    Delete Item from Cart
    @access  private 
*/
const removeFromCart = async (req, res) => {

    const product_id = req.params.product_id;

    try {
        
        const cart = await Cart.findOne({ user_id: req.authID });

        const removeItem = cart.products.filter(item => item.product_id !== product_id);
        
        cart.products = removeItem;
        await cart.save();

        res.json(cart);

    } catch (err) {
        console.log(err);
        res.status(500).send('Server Error.');
    }

}



module.exports = { userCart, addToCart, updateCart, removeFromCart }; 
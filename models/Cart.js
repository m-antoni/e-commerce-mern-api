const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CartSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    products: [
        {
            product_id: String,
            quantity: Number
        }
    ],
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }});



const Cart = mongoose.model('Cart', CartSchema); 

module.exports = Cart;
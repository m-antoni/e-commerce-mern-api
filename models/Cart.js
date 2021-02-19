const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CartSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    cart: Number,
    cart_items: []
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }});


const Cart = mongoose.model('Cart', CartSchema); 

module.exports = Cart;
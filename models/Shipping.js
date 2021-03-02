const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const shippingSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    details: [
        {
            address: {
                type: String
            },
            contact: {
                type: 'String'
            },
            is_default: {
                type: Boolean
            }
        }
    ]
}, { timestamps: {  createdAt: 'created_at', updatedAt: 'updated_at' } });


const Shipping = mongoose.model('Shipping', shippingSchema);


module.exports = Shipping;
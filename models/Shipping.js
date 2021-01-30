const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const shippingSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    dispatch: [
        {
            address: {
                type: String,
                required: true
            },
            zipcode: {
                type: String,
                required: true
            },
            contact: {
                type: 'String',
                required: true
            },
            status: {
                type: String,
                required: true
            }
            
        }
    ]
}, { timestamps: {  createdAt: 'created_at', updatedAt: 'updated_at' } });


const Shipping = mongoose.model('Shipping', shippingSchema);


module.exports = Shipping;
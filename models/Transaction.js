const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const transactionSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    transaction_code:{
        type: String,
        required: true
    }, 
    payment_type: {
        type: String,
        required: true
    },
    shipping_details: {
        address: {
            type: String
        },
        contact: {
            type: String
        }
    },
    items: [],
    amount: {
        type: Number,
        required: true 
    }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
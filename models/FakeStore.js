const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fakeStoreSchema = new Schema({
    _id: {
        type: Number,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    search: {
        type: String,
        required: true
    }
});


const FakeStore = mongoose.model('FakeStore', fakeStoreSchema, 'fake-store');

module.exports = FakeStore;
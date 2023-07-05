const mongoose = require('mongoose')

const Schema = mongoose.Schema

const orderSchema = new Schema({
    paymentId : String,
    rzpOrderId : String,
    status : String
})

module.exports = mongoose.model('Order',orderSchema)


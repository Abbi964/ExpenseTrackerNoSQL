const mongoose = require('mongoose')

const Schema = mongoose.Schema

const orderSchema = new Schema({
    paymentId : String,
    rzpOrderId : String,
    status : String
})

module.exports = mongoose.model('Order',orderSchema)

// const Order = sequelize.define('order',{
//     id:{
//         type:Sequelize.INTEGER,
//         allowNull:false,
//         autoIncrement:true,
//         primaryKey:true,
//     },
//     paymentId:Sequelize.STRING,
//     orderId:Sequelize.STRING,
//     status:Sequelize.STRING,
// })

// module.exports = Order;
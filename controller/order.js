

const Razorpay = require('razorpay');

const Order = require('../model/order');
const User = require('../model/user');

exports.purchasePremium = async (req, res, next) => {
    try {
        let user = req.user

        let rzp = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        })
        const amount = 2500;
        rzp.orders.create({ amount, currency: 'INR' }, async (err, order) => {
            if (err) {
                throw (err);
            }
            else {
                // making a new order model instence
                let odr = await Order.create({ rzpOrderId: order.id, status: 'PENDING' })

                // updating user
                let updatedArr = [...user.orders]
                updatedArr.push({ orderId : odr._id})

                user.orders = [...updatedArr]
                // saving user
                await user.save()

                res.status(201).json({ order, key_id: rzp.key_id })
            }
        })
    }
    catch (err) {

    }
}

exports.updateTransection = async (req, res, next) => {
    try {
        let user = req.user
        // we have to update the Order table and also user table
        //first usertable
        user.isPremiumUser = true;
        await user.save()
        // now orderCollection
        let order = await Order.findOne({ rzpOrderId: req.body.order_id })

        order.paymentId = req.body.payment_id;
        order.status = 'SUCCESSFUL';
        await order.save()
        
        res.status(202).json('transection successful')
    }
    catch (err) {
        console.log(err);
    }
}

exports.transectionFailed = async (req, res, next) => {
    try {
        let order = await Order.findOne({ rzpOrderId: req.body.order_id })
        
        order.status = 'FAILED';
        await order.save();
    }
    catch(err){
        console.log(err)
    }
}
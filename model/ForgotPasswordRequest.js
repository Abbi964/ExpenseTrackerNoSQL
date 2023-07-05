const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ForgotPasswordRequestSchema = new Schema({
    isActive : {
        type : Boolean,
        required : true
    },
    userId : {
        type : mongoose.Types.ObjectId,
        required : true,
        ref : 'User'
    }
});

module.exports = mongoose.model('ForgotPasswordRequest',ForgotPasswordRequestSchema)


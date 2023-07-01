const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ForgotPasswordRequestSchema = new Schema({
    isActive : {
        type : Boolean,
        required : true
    }
});

module.exports = mongoose.model('ForgotPasswordRequest',ForgotPasswordRequestSchema)

// // const ForgotPasswordRequest = sequelize.define('ForgotPasswordRequest',{
// //     id:{
// //         type: DataTypes.STRING,
// //         allowNull: false,
// //         primaryKey: true,
// //     },
// //     isActive: DataTypes.BOOLEAN,
// // })

// // module.exports = ForgotPasswordRequest;
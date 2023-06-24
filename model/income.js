const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const incomeSchema = new Schema({
    amount : {
        type : Number,
        required : true
    },
    category : {
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    userId : {
        type : mongoose.Types.ObjectId,
        required : true,
        ref : 'User'
    }
})

module.exports = mongoose.model('Income', incomeSchema)

// const Income = sequelize.define('income',{
//     id:{
//         type:DataTypes.INTEGER,
//         autoIncrement:true,
//         allowNull:false,
//         primaryKey:true,
//     },
//     amount:{
//         type:DataTypes.INTEGER,
//         allowNull: false,
//     },
//     category:{
//         type:DataTypes.STRING,
//         allowNull:false,
//     },
//     description:{
//         type:DataTypes.STRING,
//         allowNull:false,
//     },
// })

// module.exports = Income;
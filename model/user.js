const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
   name : {
    type : String,
    required : true
   },
   email: {
    type: String,
    required: true
  },
  password : {
    type: String,
    required: true
  },
  isPremiumUser : {
    type : Boolean
  },
  totalExpense : {
    type : Number,
  },
  totalIncome : {
    type : Number,
  },
  incomes : [{incomeId : {type : mongoose.Types.ObjectId, ref : 'Income'}}],
  expenses : [{expenseId : {type : mongoose.Types.ObjectId, ref : 'Expense'}}],
  orders : [{orderId : {type : mongoose.Types.ObjectId, ref : 'Order'}}],
  fileUrls : [{url : String, createdAt : String}]
})

module.exports = mongoose.model('User', userSchema)

// const User = sequelize.define('User',{
//     id:{
//         type: Sequelize.INTEGER,
//         allowNull: false,
//         autoIncrement: true,
//         primaryKey: true,
//     },
//     name:{
//         type: Sequelize.STRING,
//         allowNull: false,
//     },
//     email:{
//         type: Sequelize.STRING,
//         allowNull: false,
//     },
//     password:{
//         type: Sequelize.STRING,
//         allowNull: false,
//     },
//     isPremiumUser:Sequelize.BOOLEAN,
//     totalExpense:Sequelize.INTEGER,
//     totalIncome:Sequelize.INTEGER,
// });

// module.exports = User;
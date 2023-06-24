const User = require('../model/user');
const Expense = require('../model/expense');
const Income = require('../model/income')
const path = require('path')

exports.getLeaderboard = async(req,res,next)=>{
    try{
        let leaderboardArray = await User.find()
                .select('name totalExpense')
                .sort({ totalExpense: -1 })

        res.json({leaderboardArray:leaderboardArray})
    }
    catch(err){
        console.log(err)
    }

    //------below is a way of doing if there is no total expense column in User(but its very process hungry)---///
    // // first getting id and name from all users and adding 'amount' from expense table
    // // related to that user by joining both table using 'include'
    // let leaderboardArray = await User.findAll({
    //     attributes:['id','name',[sequelize.fn('SUM',sequelize.col('expenses.amount')),'totalAmount']],
    //     include:[
    //         {
    //             model: Expense,
    //             attributes: []
    //         }
    //     ],
    //     group: 'user.id',  // grouping by id column from user table
    //     order:[
    //         ['totalAmount','DESC']  // ordering by total amount in DESC order
    //     ]
    // })
    
}

exports.getAllExpensePage  = (req,res,next)=>{
    try{
        res.sendFile(path.join(__dirname,'..','views','allExpenses.html'))
    }
    catch(err){
        console.log(err)
    }
}

exports.getAllExpenses = async(req,res,next)=>{
    try{
        let user = req.user;
        
        // populating user incomes and expenses
        await user.populate('expenses.expenseId incomes.incomeId')

        let allExpense = [...user.expenses]
        let allIncome = [...user.incomes]
        
        res.json({incomeArray:allIncome,expenseArray:allExpense})
    }
    catch(err){
        console.log(err)
    }
}
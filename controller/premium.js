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
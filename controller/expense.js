

const path = require('path');
const Expense = require('../model/expense');
const User = require('../model/user')

const jwt = require('jsonwebtoken');


exports.getExpenseTracker = (req, res, next) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'expense.html'))
}

exports.addExpense = async (req, res, next) => {
    try {
        const amount = req.body.amount;
        const category = req.body.category;
        const description = req.body.description;
        const token = req.body.token;
        // getting userid from token
        let data = tokenToData(token)
        let userId = data.userId
        // adding info in expense table
        let expense = await Expense.create({
            amount: amount,
            category: category,
            description: description,
            userId: userId,
        })

        // getting user to update
        let user = await User.findById(userId)
        let expenseArr = [...user.expenses]
        // pushing new expenseid
        expenseArr.push({
            expenseId: expense._id
        })
        user.expenses = [...expenseArr]
        // now saving the user
        await user.save()
        res.json(expense._id.toString())
    }
    catch (err) {
        console.log(err)
    }

}

exports.getAllExpenses = async (req, res, next) => {
    try {
        let page = +req.query.page
        let user = req.user
        let maxExpPerPage = +req.query.noOfrows
        // now finding how many expenses are there
        let totalExpense = user.expenses.length
        // calculation last page
        let lastPage = Math.ceil(totalExpense / maxExpPerPage)

        // getting all expenses of user
        let populatedUser = await user.populate('expenses.expenseId');

        let expensesArray = populatedUser.expenses.splice(
            (page - 1) * +maxExpPerPage,
            +maxExpPerPage
        )

        res.json({
            expenses: expensesArray,
            havePreviousPage: page > 1,
            previousPage: page - 1,
            haveNextPage: page < lastPage,
            nextPage: page + 1,
            currentPage: page
        })
    }
    catch (err) {
        console.log(err)
    }
}

exports.deleteExpense = async (req, res, next) => {
    try {
        let expenseId = req.params.expenseId;
        let token = req.headers.authorization
        let userId = tokenToData(token).userId
        let user = await User.findById(userId)
        // finding the expense to destroy
        let exp = await Expense.findById(expenseId)

        // before deleting expense storing exp.amount so that can be substrated from total expense of user 
        let amount = exp.amount
        // checking if id of exp is same as id given in token and destroying exp
        if (userId == exp.userId) {
            // deleting expense
            await exp.deleteOne();

            // removing from user.expenses array
            let newArr = user.expenses.filter(ele =>{
                return ele.expenseId.toString() !== expenseId.toString()
            })
            user.expenses = [...newArr]
            await user.save()

            res.json({ amount: amount })
        }
        else {
            res.status(401).json('not autharized to delete')
        }
    }
    catch (err) {
        console.log(err)
    }
}



function tokenToData(token) {
    return jwt.verify(token, process.env.JWT_KEY)
}
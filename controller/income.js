

const path = require('path');
const Income = require('../model/income')
const User = require('../model/user')

const jwt = require('jsonwebtoken');

exports.addIncome = async(req,res,next)=>{
    try{
        const amount = req.body.amount;
        const category = req.body.category;
        const description = req.body.description;
        const token = req.body.token;
        // getting userid from token
        let data = tokenToData(token)
        let userId = data.userId
        // adding info in expense table
        let income = await Income.create({
            amount:amount,
            category:category,
            description:description,
            userId:userId,
        })
        // getting user to update
        let user = await User.findById(userId)
        let incomeArr = [...user.incomes]
        // pushing new expenseid
        incomeArr.push({
            incomeId : income._id
        })
        user.incomes = [...incomeArr]
        // now saving the user
        await user.save()

        res.json(income._id.toString())
    }
    catch(err){
        console.log(err)
    }
}

exports.getAllIncome = async(req,res,next)=>{
    try {
        let page = +req.query.page
        let user = req.user
        let maxExpPerPage = +req.query.noOfrows
        // now finding how many expenses are there
        let totalIncome = user.incomes.length
        // calculation last page
        let lastPage = Math.ceil(totalIncome / maxExpPerPage)

        // getting all incomes of user
        let populatedUser = await user.populate('incomes.incomeId');

        let incomeArray = populatedUser.incomes.splice(
            (page - 1) * +maxExpPerPage,
            +maxExpPerPage
        )

        res.json({
            incomes: incomeArray,
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

exports.deleteIncome = async(req,res,next)=>{
    try{
        let incomeId = req.params.incomeId;
        let token = req.headers.authorization;
        // getting userID from token
        let data = tokenToData(token)
        let userId = data.userId
        let user = await User.findById(userId)
        // finding the expense to destroy
        let inc = await Income.findById(incomeId)
        // before deleting income storing inc.amount so that can be substrated from total income of user
        let amount = inc.amount
        // checking if id of inc is same as id given in token and destroying inc
        if(userId==inc.userId){
            // deleting expense
            await inc.deleteOne();

            // removing from user.expenses array
            let newArr = user.incomes.filter(ele =>{
                return ele.incomeId.toString() !== incomeId.toString()
            })
            user.incomes = [...newArr]
            await user.save()

            res.json({amount:amount})
        }
        else{
            res.status(401).json('not autharized to delete')
        }
    }
    catch(err){
        await t.rollback()
        console.log(err)
    }
}

function tokenToData(token){
    return jwt.verify(token,process.env.JWT_KEY)
}

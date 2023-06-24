const path  = require('path')

const bcrypt = require('bcrypt')

const jwt = require('jsonwebtoken')

const User = require('../model/user')

const AWS = require('aws-sdk')
const { reject } = require('bcrypt/promises')

const UserServices = require('../services/user');
const S3Services = require('../services/s3');

exports.getSignUpPage = (req,res,next)=>{
    res.sendFile(path.join(__dirname,'..','views','signup.html'));
}

exports.postSignupPage = async(req,res,next)=>{
    try{
        const name = req.body.name
        const email = req.body.email
        const password = req.body.password
        // hashing the password
        bcrypt.hash(password,10,async(err,hash)=>{
            // finding or creating user
            let user = await User.findOne({email:email})
            if(!user){
                await User.create({
                    name:name,
                    email:email,
                    password:hash,
                    isPremiumUser:false,
                    totalExpense:0,
                    totalIncome:0,
                })
    
            }
            res.json(user === null);
        })
    }
    catch(err){
        console.log(err)
    }
}

exports.getLoginPage = (req,res,next)=>{
    res.sendFile(path.join(__dirname,'..','views','login.html'))
}

exports.postLoginPage = async(req,res,next)=>{
    try{
        const email = req.body.email;
        const password = req.body.password;
        let user = await User.findOne({email:email});
        // checking if user email exists in DB or not
        if(user===null){
            res.status(404).json({msg:'User not found'})
        }
        else{
            bcrypt.compare(password,user.password,async(err,same)=>{
                if (err) {
                    console.log(err);
                    res.status(500).json({ msg: 'Internal server error' });
                }
                else if(same){
                    
                    res.json({msg:'logging in user',token:generateJWT(user._id , user.isPremiumUser)})
                }
                else{
                    res.status(401).json({msg:'User not authorized'})
                }
            })
        }
    }
    catch(err){
        t.rollback();
        console.log(err)
    }
}

exports.isPremium = (req,res,next)=>{
    try{
        let token = req.headers.authorization
        let data = tokenToData(token)
        res.json({isPremiumUser:data.isPremium}) 
    }
    catch(err){
        console.log(err)
    }
}

exports.makePremiumInLocalStorage = (req,res,next)=>{
    const token = req.headers.authorization
    let data = tokenToData(token);
    let newToken =  generateJWT(data.userId,true)
    res.json({token:newToken}) 
}

exports.addToTotalExpense = async(req,res,next)=>{
    try{
        amount = req.body.amount
        token = req.body.token
        let data = tokenToData(token);
        let userId = data.userId;
        let user = await User.findOne({_id:userId})

        user.totalExpense = parseInt(user.totalExpense) + parseInt(amount)
        await user.save();
        res.json('updated')
    }
    catch(err){
        console.log(err)
    }
}

exports.addToTotalIncome = async(req,res,next)=>{
    try{
        amount = req.body.amount
        token = req.body.token
        let data = tokenToData(token);
        let userId = data.userId;
        let user = await User.findOne({_id:userId})
        
        user.totalIncome = parseInt(user.totalIncome) + parseInt(amount)
        user.save();
        res.json('updated')
    }
    catch(err){
        await t.rollback()
        console.log(err)
    }
}

exports.downloadExpense = async(req,res,next)=>{
    try{
        let user = req.user
        await user.populate('incomes.incomeId expenses.expenseId')
        let incExp = {incomes : [...user.incomes], expenses : [...user.expenses]}
        let stringifiedIncExp = JSON.stringify(incExp)
        // filename should depend on user id and time of request
        let filename = `Expense-${user.id}/${new Date}.txt`
        let fileUrl = await S3Services.uploadToS3(stringifiedIncExp,filename)
        res.json({fileUrl,success:true})
    }
    catch(err){
        console.log(err)
    }
}

exports.saveFileUrl = async(req,res,next)=>{
    try{
        let user = req.user
        // saving file url in user.fileUrls
        let newArr = [...user.fileUrls]
        newArr.push({url : req.body.fileUrl, createdAt : new Date()})
        user.fileUrls = [...newArr]

        // saving user
        await user.save()
        res.json('done')
    }
    catch(err){
        console.log(err)
    }
}

exports.getFileUrls = async(req,res,next)=>{
    try{
        let user = req.user
        // getting all file urls downloaded by user
        let fileUrlArray = user.fileUrls
        res.json({downloadedFiles:fileUrlArray})
    }
    catch(err){
        console.log(err)
    }
}


function generateJWT(id,isPremiumUser){
    return jwt.sign({userId:id , isPremium:isPremiumUser},process.env.JWT_KEY)
}

function tokenToData(token){
    return jwt.verify(token,process.env.JWT_KEY)
}
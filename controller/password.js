const path = require('path')

const uuid = require('uuid')

const bcrypt = require('bcrypt')

const User = require('../model/user')
const ForgotPasswordRequest = require('../model/ForgotPasswordRequest')


var SibApiV3Sdk = require('sib-api-v3-sdk');
var defaultClient = SibApiV3Sdk.ApiClient.instance;
var apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.SEND_IN_BLUE_API_KEY

exports.getforgotPassword = (req,res,next)=>{
    res.sendFile(path.join(__dirname,'..','views','forgotPassword.html'))
}

exports.postForgotPassword = async(req,res,next)=>{
    try{
        // finding user from user table by email
        let user = await User.findOne({email:req.body.email})

        if(!user){
            return res.json({msg:'User with this email has not signed up'})
        }
        
        let newReq = await ForgotPasswordRequest.create({isActive : true,userId : user._id})

        // saving id of this request
        let id = newReq._id;
        // making a new tansactional email instence
        const tranEmailApi = new SibApiV3Sdk.TransactionalEmailsApi();
        
        const sender = {
            email: 'abhinavthapliyal964@gmail.com'
        }
    
        const receivers = [
            {
                email: req.body.email
            },
        ]
        
        // sending a tansactional email
        let result = await tranEmailApi.sendTransacEmail({
            sender,
            to: receivers,
            subject: 'Reset your password',
            htmlcontent: `<p>To reset your password<a href="http://localhost:3000/password/resetPassword/${id}" > click here</a></p>`
        })

        res.json({msg:'An email with link to reset your password has been sent to your email',id:result.messageId,reqId : id})   
    }
    catch(err){
        console.log(err)
    }
}

exports.getResetPassword = async(req,res,next)=>{
    let id = req.params.id;
    // checking if request is active
    let passRes = await ForgotPasswordRequest.findById(id);
    if(passRes.isActive===false){
        res.status(404).send('<html><head></head><body><h1>request is not active</h1></body></html>')
    }
    else{
        res.sendFile(path.join(__dirname,'..','views','resetPassword.html'));
    }
}

exports.postResetPassword = async(req,res,next)=>{
    try{
        let id = req.params.id;
        // finding user with this ResetPasswordId
        let passRes = await ForgotPasswordRequest.findById(id);
        let newPassword = req.body.password
        bcrypt.hash(newPassword,10,async(err,hash)=>{
            // updating user with new password
            await User.updateOne({_id:passRes.userId},{password:hash})

            // setting isActive in ForgotPasswordRequest to false
            await ForgotPasswordRequest.updateOne({_id : id},{isActive:false})

        })
        res.json({msg:'Password reseting is successful'})
    }
    catch(err){
        console.log(err)
    }
}
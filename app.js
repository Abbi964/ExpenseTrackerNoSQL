require('dotenv').config()

const helmet = require('helmet')   // for secure headers

const compression = require('compression') // for compressing 

const morgan = require('morgan')  // for logging 

const mongoose = require('mongoose')

const cors = require('cors')

const path = require('path');
const fs = require('fs')

const bodyParser = require('body-parser')  // to parse data chunks

const express = require('express');
const app = express();

const userRoutes = require('./routes/user');
const expenseRoutes = require('./routes/expense');
const orderRoutes = require('./routes/order');
const premiumRoutes = require('./routes/premium');
const passwordRoutes = require('./routes/password');
const incomeRoutes = require('./routes/income');

// const User = require('./model/user');
// const Expense = require('./model/expense');
// const Order = require('./model/order')
// const ForgotPasswordRequest = require('./model/ForgotPasswordRequest')
// const Income = require('./model/income');
// const FileUrl = require('./model/fileUrl');

// Enable CORS for all routes
app.use(cors());

// using morgan to log activities
   // first making the stream to log file
const accessLogStream = fs.createWriteStream(
    path.join(__dirname,'access.log'),
    {flags:'a'}    // this will append
    )
app.use(morgan('combined',{stream:accessLogStream}));
// making public static
app.use(express.static(path.join(__dirname,'public')));
// adding body parser
app.use(bodyParser.json());

// redirecting get req on '/' to sign up page
app.get('/',(req,res,next)=>{
    res.redirect('/user/signup')
})

app.use('/user',userRoutes);
app.use('/expense',expenseRoutes);
app.use('/order',orderRoutes);
app.use('/premium',premiumRoutes);
app.use('/password',passwordRoutes);
app.use('/income',incomeRoutes);


// // defining relation between user and expense
// User.hasMany(Expense);
// Expense.belongsTo(User);

// // defining relation between user and income
// User.hasMany(Income);
// Income.belongsTo(User);

// // defining relation between User and Order
// User.hasMany(Order);
// Order.belongsTo(User);

// // defining relation between User and ForgotPasswordRequest
// User.hasMany(ForgotPasswordRequest);
// ForgotPasswordRequest.belongsTo(User);

// // defining relation between User and FileUrl
// User.hasMany(FileUrl);
// FileUrl.belongsTo(User);

mongoose.connect(`mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.vghsxbb.mongodb.net/ExpenseTracker?retryWrites=true`)
    .then(result => {
        // connecting to DB and starting server
        console.log('Connected to mongoDB using mongoose');
        app.listen(3000)
    })
    .catch(err => console.log(err))


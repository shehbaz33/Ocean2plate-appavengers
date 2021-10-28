require('dotenv').config()
const express = require('express')
const app = express()
const ejs = require('ejs')
const path = require('path')
const expressLayout = require('express-ejs-layouts')
const PORT = process.env.PORT || 3000
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('express-flash')
const { collection } = require('./app/models/menu')
let MongoDbStore = require('connect-mongo')


const MONGO_URL = process.env.MONGO_URL
 mongoose.connect(MONGO_URL,{useNewUrlParser :true,useUnifiedTopology:true});
 const connection = mongoose.connection;

 try {
    connection.once('open',() => {
        console.log('Connection successfull...')
    })
} catch (error) {
    console.log('Connection not successfull')
}

app.use(
    session({
        secret: process.env.COOKIE_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie:{maxAge:1000 * 60 * 60 * 24},
        store: MongoDbStore.create({
            mongoUrl:process.env.MONGO_URL,
            collection:'sessions'
        })
    })
);


app.use(flash())
// Session middleware for accessing in frontend
app.use((req,res,next) => {
    res.locals.session = req.session
    next()
})

app.use(express.static('public'))
app.use(express.json())

app.use(expressLayout);
app.set('views', path.join(__dirname,'/resources/views'))
app.set('view engine','ejs');


require('./routes/web')(app)







// DATABASE CONNECTION















app.listen(PORT,() => {
    console.log(`Listening on port ${PORT}`)
})
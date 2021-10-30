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
const passport = require('passport')
const Emitter = require('events')


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

const eventEmitter = new Emitter()
app.set('eventEmitter',eventEmitter)

app.use(
    session({
        secret: process.env.COOKIE_SECRET,
        resave: true,
        saveUninitialized: true,
        cookie:{maxAge:1000 * 60 * 60 * 24},
        store: MongoDbStore.create({
            mongoUrl:process.env.MONGO_URL,
            collection:'sessions'
        })
    })
);

const passportInit = require('./app/config/passport')
passportInit(passport)

app.use(passport.initialize())
app.use(passport.session())


app.use(flash())

// Session middleware for accessing in frontend
app.use((req,res,next) => {
    res.locals.session = req.session
    res.locals.user = req.user
    next()
})

app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({extended:false}))

app.use(expressLayout);
app.set('views', path.join(__dirname,'/resources/views'))
app.set('view engine','ejs');


require('./routes/web')(app)







// DATABASE CONNECTION
const server = app.listen(PORT,() => {
    console.log(`Listening on port ${PORT}`)
})

const io = require('socket.io')(server)

io.on('connection',(socket) => {
    socket.on('join',(orderId) => {
        socket.join(orderId)
    })
})

eventEmitter.on('orderUpdated', (data) => {
    io.to(`order_${data.id}`).emit('orderUpdated',data)
})

eventEmitter.on('orderPlaced', (data) => {
    io.to('adminRoom').emit('orderPlaced',data)
})
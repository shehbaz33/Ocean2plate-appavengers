const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000
const expressLayout = require('express-ejs-layouts')
const ejs = require('ejs')
const path = require('path')
app.use(expressLayout);
app.set('view engine','ejs');
app.set('views', path.join(__dirname,'/resources/views'))

app.use(express.static('public'))

app.get('/', (req,res) => {
    res.render('home')
})

app.get('/cart',(req,res) => {
    res.render('customers/cart')
})

app.get('/login',(req,res) => {
    res.render('auth/login')
})

app.get('/register',(req,res) => {
    res.render('auth/register')
})






app.listen(PORT,() => {
    console.log(`Listening on port ${PORT}`)
})
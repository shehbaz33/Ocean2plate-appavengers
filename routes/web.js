const authController = require('../app/http/controllers/authController');
const homeController = require('../app/http/controllers/homeController')
const cartController = require('../app/http/controllers/customers/cartController')
const guest = require('../app/http/middleware/guest')
const orderController = require('../app/http/controllers/customers/orderController')
const auth = require('../app/http/middleware/auth')
const adminOrderController = require('../app/http/controllers/admin/orderController')
const isAdmin = require('../app/http/middleware/admin');


function initRoutes (app){
    app.get('/',homeController().index)
    app.get('/cart',cartController().index)
    app.get('/login',guest,authController().login)
    app.post('/login',authController().postLogin)
    app.get('/register',guest,authController().register)
    app.post('/register',authController().postRegister)
    app.post('/logout',authController().logout)
    app.post('/update-cart',cartController().update)
    
    // Customer routes
    app.post('/orders', auth ,orderController().store)
    app.get('/customer/order', auth ,orderController().index)

    // Admin routes
    app.get('/admin/orders',isAdmin,adminOrderController().index)
}

module.exports = initRoutes;
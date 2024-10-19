const UserRouter = require('./UserRouter')
const ProductRouter = require('./ProductRouter')
const OrderRouter = require('./OrderRouter')
const DiscountRouter = require('./DiscountRouter')
const PaymentRouter = require('./PaymentRouter')
const orderVNPAY = require('./orderVNPAY')
const routes = (app) => {
    app.use('/api/user', UserRouter)
    app.use('/api/product', ProductRouter)
    app.use('/api/order', OrderRouter)
    app.use('/api/discount', DiscountRouter)
    app.use('/api/payment',PaymentRouter)
    app.use('/api/vnpay',orderVNPAY)

}

module.exports = routes
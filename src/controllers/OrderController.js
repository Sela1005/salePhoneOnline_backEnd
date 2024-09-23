const Orderservice = require('../services/OrderService')

const createOrder = async (req, res) => {
    try {
        const {paymentMethod, itemsPrice, shippingPrice,totalPrice,fullName,address,city,phone} = req.body
        if(!paymentMethod||!itemsPrice||!shippingPrice||!totalPrice||!fullName||!address||!city||!phone){
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is required'
            })
        }
        const response = await Orderservice.createOrder(req.body)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getDetailOrder = async (req, res) => {
    try {
        const userId = req.params.id
        if(!userId){
            return res.status(200).json({
                status: "ERR",
                message: "The userId is required"
            })
        }
        const response = await Orderservice.getOrderDetails(userId)
        return res.status(200).json(response)
    } catch(e) {
        return res.status(404).json({
            message: e
        })
    }
}
const getAllOrder = async (req, res) => {
    try {
        const data = await Orderservice.getAllOrder()
        return res.status(200).json(data)
    } catch(e) {
        return res.status(404).json({
            message: e
        })
    }
}
module.exports = {
    createOrder,
    getDetailOrder,
    getAllOrder
}
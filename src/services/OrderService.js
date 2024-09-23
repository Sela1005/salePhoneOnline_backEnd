
const Order = require("../models/OrderProduct")
const Product = require("../models/ProductModel")

const createOrder = (newOrder) => {
    return new Promise(async(resolve, reject)=> {
        const {orderItems, paymentMethod, itemsPrice, shippingPrice, fullName,address,city, phone,totalPrice,user} = newOrder
        try{
             const promises = orderItems.map(async (order)=>{
                const productData = await Product.findOneAndUpdate(
                    {
                    _id: order.product,
                    countInStock:{$gte: order.amount}
                    },
                    {$inc: {
                        countInStock: -order.amount,
                        selled: +order.amount
                    }},
                    {
                        new: true   
                    }
                )
                if(productData){
                    const createdOrder = await Order.create({
                        orderItems,
                        shippingAddress: {
                            fullName,
                            address,
                            city,
                            phone
                        },
                        paymentMethod,
                        itemsPrice,
                        shippingPrice,
                        totalPrice,
                        user: user,
                    })
                    if(createdOrder){
                        return{
                            status: 'OK',
                            message: 'SUCCESS',
                        }
                    }
                }else {
                    return{
                        status: 'OK',
                        message: 'ERR',
                        id: order.product
                    }
                }
            })
            const results = await Promise.all(promises)
            const newData =results && results.filter((item) => item.id)
            if(newData.length) {
                resolve({
                    status: 'ERR',
                    message: `San pham voi id${newData.join(',')} khong du sach`
                })
            }
            resolve({
                status: 'OK',
                message: 'success'
            })
        }catch (e){
            console.log('e', e)
            reject(e)
        }
    })
}


// const deleteManyProduct = (ids) => {
//     return new Promise( async (resolve, reject) => {
//         try {
           
//            await Product.deleteMany({_id: ids})
//             resolve({
//                 status: "OK",
//                 message: "DELETE PRODUCT SUCCESS",
//                 })
//         } catch (e) {
//             reject(e)
//         }
//     })
// }

const getOrderDetails  = (id) => {
    return new Promise( async (resolve, reject) => {
        try {
            const order = await Order.findOne({
                user: id
            })
           if(order === null) {
                resolve({
                    status: "OK",
                    message: "The order is not defined"
                })
           }
            resolve({
                status: "OK",
                message: "SUCCESS",
                data: order
                })
        } catch (e) {
            reject(e)
        }
    })
}

const getAllOrder = () => {
    return new Promise( async (resolve, reject) => {
        try {
           const allOrder= await Order.find()
            resolve({
                status: "OK",
                message: "SUCCESS",
                data: allOrder
                })
        } catch (e) {
            reject(e)
        }
    })
}
module.exports = {
    createOrder,
    getOrderDetails,
    getAllOrder
}
// OrderFactory.js
const Order = require("../models/OrderProduct");
const Product = require("../models/ProductModel");

class OrderFactory {
  static async createOrder(orderData) {
    const {
      orderItems,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      fullName,
      address,
      city,
      phone,
      totalPrice,
      user,
      discountCode,
      discountPercentage,
      isPaid,
      paidAt,
    } = orderData;
    
    try {
        // Kiểm tra và cập nhật số lượng cho từng sản phẩm trong orderItems
      const updateResults = await Promise.all(orderItems.map(async (order) => {
        const productData = await Product.findOneAndUpdate(
            {
              _id: order.product,
              countInStock: { $gte: order.amount },
            },
            {
              $inc: {
                countInStock: -order.amount,
                selled: +order.amount,
              },
            },
            { new: true }
          );

          if (!productData) {
            // Nếu không đủ hàng, lấy tên sản phẩm để thông báo lỗi.
            const outOfStockProduct = await Product.findById(order.product).select("name");
            return { status: "ERR", id: order.product, name: outOfStockProduct?.name || "Unknown" };
          }
          return { status: "OK" };
        })
      );

      // Lọc ra các sản phẩm không đủ hàng
      const insufficientStock = updateResults.filter((result) => result.status === "ERR");
      if (insufficientStock.length > 0) {
        return {
          status: "ERR",
          message: `Sản phẩm không đủ hàng: ${insufficientStock.map((item) => item.name).join(", ")}`,
        };
      }

      // Tạo đơn hàng mới nếu tất cả sản phẩm đủ hàng.
      const createdOrder = await Order.create({
        orderItems,
        shippingAddress: {
          fullName,
          address,
          city,
          phone,
        },
        paymentMethod,
        itemsPrice,
        shippingPrice,
        discountCode,
        discountPercentage,
        totalPrice,
        user,
        isPaid,
        paidAt,
      });

      if (createdOrder) {
        return {
          status: "OK",
          message: "SUCCESS",
          data: createdOrder,
        };
      }
      return { status: "ERR", message: "Failed to create order" };
    } catch (error) {
      console.log("Error in OrderFactory.createOrder:", error);
      throw error;
    }
  }
}

module.exports = OrderFactory;

const mongoose = require("mongoose");

const Order = mongoose.model("Order");
const Product = mongoose.model("Product");
const BaseError = require("../errors/base.error");
class OrderService {
  // create order
  async create(data, lang) {
    if (!data) {
      const messages = {
        uz: "Iltimos buyurtma yarating",
        ru: "Пожалуйста, оформите заказ.",
        en: "Please create an order.",
      };
      throw BaseError.BadRequest(messages, _, lang);
    }
    const { user, orderItems, shippingAddress, paymentMethod } = order;
    // item price
    const itemPrice = orderItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0,
    );

    // tax price
    const taxPrice = itemPrice * 0.15;

    // shipping price
    const shippingPrice = itemPrice > 100000 ? 0 : 100000;

    // total price
    const totalPrice = itemPrice + taxPrice + shippingPrice;

    const order = new Order({
      user,
      orderItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
      shippingPrice,
      itemPrice,
    });

    const newOrder = await order.save();
    const messages = {
      uz: "Buyurtma muvaffaqiyatli yaratildi.",
      ru: "Заказ успешно оформлен.",
      en: "Order created successfully.",
    };
    return {
      success: true,
      message: messages[lang],
      data: newOrder,
    };
  }

  // get orders
  async getOrders(options, lang) {
    const { page = 1, limit = 10, status } = options;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const count = await Order.countDocuments();
    const filter = {};

    if (status) {
      filter.status = status;
    }
    const orders = await Order.find(filter)
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 })
      .populate("user", "id email username")
      .populate("orderItems.product", "name image price id slug")
      .populate("orderItems.shop", "id name contact slug");

    return {
      success: true,
      data: orders.map((order) => order.toJSON({ lang })),
      pagination: {
        pages: Math.ceil(count / parseInt(limit)),
        page,
        limit,
        count,
      },
    };
  }

  // get user orders
  async getUsersOrder(options, userId, lang) {
    const { page = 1, limit = 10, status } = options;
    const filter = {};
    if (status) {
      filter.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const count = await Order.countDocuments({ user: userId });
    const orders = await Order.findOne({ user: userId })
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 })
      .populate("user", "id email username")
      .populate("orderItems.product", "name image price id slug")
      .populate("orderItems.shop", "id name contact slug");

    return {
      success: true,
      data: orders.map((order) => order.toJSON({ lang })),
      pagination: {
        pages: Math.ceil(count / parseInt(limit)),
        page,
        limit,
        count,
      },
    };
  }

  // get order by id
  async getOrderById(orderId, lang) {
    const order = await Order.findById(orderId)
      .populate("user", "id email username")
      .populate("orderItems.product", "name image price id slug")
      .populate("orderItems.shop", "id name contact slug");

    if (!order) {
      throw BaseError.NotFound("Order", lang);
    }

    return {
      success: true,
      data: order.toJSON({ lang }),
    };
  }

  // get order by shop
  async getOrdersByShop(shopId, options, lang) {
    const { page = 1, limit = 10 } = options;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const orders = await Order.findOne({ "orderItems.shop": shopId })
      .limit(limit)
      .skip(skip)
      .sot({ createdAt: -1 })
      .populate("user", "id email username")
      .populate("orderItems.product", "name image price id slug")
      .populate("orderItems.shop", "id name contact slug");

    const count = await Order.countDocuments({ orderItems: shopId });

    return {
      success: true,
      data: orders.map((order) => order.toJSON({ lang })),
      pagination: {
        total: count,
        limit,
        pages: Math.ceil(count / parseInt(limit)),
        page,
      },
    };
  }

  // get order by product
  async getOrdersByProcut(productId, options, lang) {
    const { page = 1, limit = 10 } = options;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const orders = await Order.findOne({ "orderItems.product": productId })
      .limit(limit)
      .skip(skip)
      .sot({ createdAt: -1 })
      .populate("user", "id email username")
      .populate("orderItems.product", "name image price id slug")
      .populate("orderItems.shop", "id name contact slug");

    const count = await Order.countDocuments({
      "orderItems.product": productId,
    });

    return {
      success: true,
      data: orders.map((order) => order.toJSON({ lang })),
      pagination: {
        total: count,
        limit,
        pages: Math.ceil(count / parseInt(limit)),
        page,
      },
    };
  }

  // get single order by shop
  async getOrderByShop(shopId, orderId, lang) {
    const order = await Order.findOne({
      _id: orderId,
      "orderItems.shop": shopId,
    })
      .populate("user", "id email username")
      .populate("orderItems.product", "name image price id slug")
      .populate("orderItems.shop", "id name contact slug");

    if (!order) throw BaseError.NotFound(null, lang);

    const orderObj = order.toJSON({ lang });

    // filter items only show specified shop
    orderObj.orderItems = order.orderItems.filter(
      (pro) => pro.shop.id === shopId,
    );

    // calculate shop total
    orderObj.shopTotal = orderObj.orderItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0,
    );
    return {
      success: true,
      data: order.toJSON({ lang }),
    };
  }

  // get single order jenson buttonby product
  async getOrderByProdyct(orderId, productId, lang) {
    const order = await Order.findOne({
      _id: orderId,
      "orderItems.product": productId,
    })
      .populate("user", "id email username")
      .populate("orderItems.product", "name image price id slug")
      .populate("orderItems.shop", "id name contact slug");

    if (!order) throw BaseError.NotFound(null, lang);
    const orderObj = order.toJSON({ lang });

    // filter items only show the specified product
    orderObj.orderItems = order.orderItems.filter(
      (pro) => pro.product.id === productId,
    );

    // calculate product total
    orderObj.productTotal = orderObj.orderItems.reduce(
      (acc, item) => acc + (item, price * item.quantity),
      0,
    );
    return {
      success: true,
      data: orderObj,
    };
  }

  // get order statistics
  async getOrdersStats() {}
  // update order to paid
  async updateOrderToPaid(orderId, data, lang) {
    const order = await Order.findById(orderId);

    if (!order) {
      throw BaseError.NotFound("Order", lang);
    }

    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: data.id || `PAY_${Date.now()}`,
      status: data.status || "completed",
      update_time: data.update_time || new Date().toISOString(),
      email_address: data.email_address || req.user.email,
    };

    const updateOrder = await order.save();
    return {
      success: true,
      data: updateOrder.paymentResult,
    };
  }

  // update order to delivered
  async updateOrderToDelivered(orderId, lang) {
    const order = await Order.findById(orderId);

    if (!order) throw BaseError.NotFound(null, lang);

    order.isDelivered = true;
    order.deliveredAt = Date.now();
    order.orderStatus = "delivered";

    const updateOrder = await order.save();
    return {
      success: true,
      data: updateOrder,
    };
  }

  // cancel order
  async cancelOrder(orderId, lang) {
    const order = await Order.findById(orderId);

    if (!order) {
      throw BaseError.NotFound(null, lang);
    }

    if (order.orderStatus !== "shipped") {
      throw BaseError.Conflict(null, lang);
    }
    for (const item of order.orderItems) {
      const product = await Product.findById(item.product);

      if (product) {
        if (product.inventory.variants.length > 0) {
          product.inventory.variants[0].stock += item.quantity;
        }
        product.inventory.totalQuantity = product.inventory.variants.reduce(
          (total, variant) => total + variant.stock,
          0,
        );
        await product.save();
      }

      order.orderStatus = "canceled";

      await order.save();

      return {
        success: true,
        data: order,
      };
    }
  }

  // update order status
  async updateOrderStatus(status, orderId, lang) {
    const order = await Order.findById(orderId);

    if (!order) {
      throw BaseError.NotFound(null, lang);
    }

    if (!["shipped", "delivered", "canceled"].includes(status)) {
      throw BaseError.Conflict(null, lang);
    }

    order.status = status;
    if (status === "delivered") {
      ((order.isDelivered = true), (order.deliveredAt = Date.now()));
    }
    const updateOrder = await order.save();

    return {
      success: true,
      data: updateOrder,
    };
  }

  // requst return
  async requestReturn(orderId, reason, quantity, product) {
    const order = await Order.findById(orderId);

    if (!order) throw BaseError.NotFound("order", lang);

    if (!order.isDelivered) throw BaseError.Conflict(null, lang);

    const orderItem = order.orderItems.find((item) => item.product === product);

    if (!orderItem) throw BaseError.NotFound("product", lang);

    if (quantity > orderItem.quantity) {
      const messages = {
        uz: "Qaytarilgan summa sotib olingan summadan oshib ketdi",
        ru: "Количество возвращенных товаров превышает количество приобретенных товаров.",
        en: "Return quantity exceeds purchased quantity",
      };
      throw BaseError.Conflict(messages, lang);
    }

    const existingReturnProduct = order.returnProduct.find(
      (ret) => ret.product === product,
    );

    if (existingReturnProduct) {
      const messages = {
        uz: "Ushbu mahsulot uchun qaytarish so'rovi allaqachon kutilmoqda",
        ru: "Запрос на возврат данного товара уже находится на рассмотрении.",
        en: "Return request already pending for this product",
      };
      throw BaseError.Conflict(messages, lang);
    }

    order.returnProduct.push({
      product,
      quantity,
      reason,
      status: "approved",
      requestAt: Date.now(),
    });

    const returnProductOrder = await order.save();

    return {
      success: true,
      data: returnProductOrder,
    };
  }

  // update return status
  async updateReturnStatus(returnId, status, lang) {
    const order = await Order.findOne({ "returnProduct._id": returnId });

    if (!order) throw BaseError.NotFound("Order", lang);

    const returnItem = order.returnProduct.id(returnId);

    if (!returnItem) throw BaseError.NotFound("Return product", lang);

    returnItem.status = status;

    if (status === "approved") {
      const orderItem = order.orderItems.find(
        (item) => item.product === returnItem.product,
      );

      if (orderItem) {
        const refundAmount = orderItem.price * returnItem.quantity;
        order.refundedTotal += refundAmount;
      }
    } else if (status === "refunded") {
      returnItem.refundedAt = Date.now();
    }

    await order.save();

    return {
      success: true,
      data: returnItem,
    };
  }
}
module.exports = new OrderService();

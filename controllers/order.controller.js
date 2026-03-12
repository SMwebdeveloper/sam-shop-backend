const orderService = require("../service/order.service");
class OrderController {
  // create order
  async create(req, res, next) {
    try {
      const data = req.body;
      const response = await orderService.create(data, req.lang);
      return res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  // get all orders
  async getOrders(req, res, next) {
    try {
      const response = await orderService.getOrders(req.query, req.lang);
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  // get order by id
  async getOrderById(req, res, next) {
    try {
      const { id } = req.params;
      const response = await orderService.getOrderById(id, req.lang);
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  // get order users
  async getUserOrders(req, res, next) {
    try {
      const response = await orderService.getUsersOrder(
        req.query,
        req.user._id,
        req.lang,
      );
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
  // get orders by shop
  async getOrdersByShop(req, res, next) {
    try {
      const { shopId } = req.params;
      const response = await orderService.getOrdersByShop(
        shopId,
        req.query,
        req.lang,
      );
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  // get orders by product
  async getOrdersByProduct(req, res, next) {
    try {
      const { productId } = req.params;
      const response = await orderService.getOrdersByProcut(
        productId,
        req.query,
        req.lang,
      );
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  // get single order by shop
  async getOrderByShop(req, res, next) {
    try {
      const { shopId, orderId } = req.params;
      const response = await orderService.getOrderByShop(
        shopId,
        orderId,
        req.lang,
      );
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  // get single order by product
  async getOrderByProduct(req, res, next) {
    try {
      const { productId, orderId } = req.params;
      const response = await orderService.getOrderByProdyct(
        productId,
        orderId,
        req.lang,
      );
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  // update order to paid
  async updateOrderToPaid(req, res, next) {
    try {
      const { orderId } = req.params;
      const response = await orderService.updateOrderToPaid(
        orderId,
        req.body,
        req.lang,
      );
      return res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  // update order to delivered
  async updateOrderToDelivered(req, res, next) {
    try {
      const { orderId } = req.params;
      const response = await orderService.updateOrderToDelivered(
        orderId,
        req.lang,
      );
      return res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  // cancel order
  async cancelOrder(req, res, next) {
    try {
      const { orderId } = req.params;
      const response = await orderService.cancelOrder(orderId, lang);
      return res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  // update order status
  async updateOrderStatus(req, res, next) {
    try {
      const { orderId } = req.params;
      const response = await orderService.updateOrderStatus(
        req.body.status,
        orderId,
        req.lang,
      );
      return res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  // request return
  async requestReturn(req, res, next) {
    try {
      const { orderId } = req.params;
      const { reason, quantity, product } = req.body;
      const response = await orderService.requestReturn(
        orderId,
        reason,
        quantity,
        product,
      );
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  // update return status
  async updateReturnStatus(req, res, next) {
    try {
      const { returnId } = req.params;
      const response = await orderService.updateReturnStatus(
        returnId,
        req.body.status,
        req.lang,
      );
      return res.status(200).json(response)
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new OrderController();

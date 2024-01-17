import { Next, Request, Response } from "restify";
import orderItemRepository from "../repositories/order-item.repository";
import { CreateOrderItemDTO, UpdateOrderItemDTO } from "../dto/order-item.dto";

class OrderItemController {
  async create(req: Request, res: Response, next: Next) {
    const createOrderItemDTO: CreateOrderItemDTO = req.body;
    return orderItemRepository
      .save(createOrderItemDTO)
      .then((createdOrderItem) => {
        res.send(201, createdOrderItem);
        return next();
      })
      .catch((error) => {
        console.error("Error creating order item:", error);
        res.send(500, "Internal Server Error");
        return next();
      });
  }

  async getById(req: Request, res: Response, next: Next) {
    const orderItemId: number = parseInt(req.params.id, 10);
    return orderItemRepository
      .retrieveById(orderItemId)
      .then((orderItem) => {
        if (orderItem) {
          res.send(200, orderItem);
        } else {
          res.send(404, "Order Item not found");
        }
        return next();
      })
      .catch((error) => {
        console.error("Error getting order item by ID:", error);
        res.send(500, "Internal Server Error");
        return next();
      });
  }

  async update(req: Request, res: Response, next: Next) {
    const updateOrderItemDTO: UpdateOrderItemDTO = req.body;
    const orderItemId: number = parseInt(req.params.id, 10);
    return orderItemRepository
      .update(orderItemId, updateOrderItemDTO)
      .then((updatedOrderItem) => {
        if (updatedOrderItem) {
          res.send(200, updatedOrderItem);
        } else {
          res.send(404, "Order Item not found");
        }
        return next();
      })
      .catch((error) => {
        console.error("Error updating order item:", error);
        res.send(500, "Internal Server Error");
        return next();
      });
  }

  async delete(req: Request, res: Response, next: Next) {
    const orderItemId: number = parseInt(req.params.id, 10);
    return orderItemRepository
      .delete(orderItemId)
      .then((rowsAffected) => {
        if (rowsAffected > 0) {
          res.send(204);
        } else {
          res.send(404, "Order Item not found");
        }
        return next();
      })
      .catch((error) => {
        console.error("Error deleting order item:", error);
        res.send(500, "Internal Server Error");
        return next();
      });
  }
}

export default new OrderItemController();

import { Next, Request, Response } from "restify";
import orderMasterRepository from "../repositories/order-master.repository";
import {
  CreateOrderMasterDTO,
  UpdateOrderMasterDTO,
} from "../dto/order-master.dto";

class OrderMasterController {
  async create(req: Request, res: Response, next: Next) {
    const createOrderMasterDTO: CreateOrderMasterDTO = req.body;
    return orderMasterRepository
      .save(createOrderMasterDTO)
      .then((createdOrderMaster) => {
        res.send(201, createdOrderMaster);
        return next();
      })
      .catch((error) => {
        console.error("Error creating order master:", error);
        res.send(500, "Internal Server Error");
        return next();
      });
  }

  async getById(req: Request, res: Response, next: Next) {
    const orderMasterId: number = parseInt(req.params.id, 10);
    return orderMasterRepository
      .retrieveById(orderMasterId)
      .then((orderMaster) => {
        if (orderMaster) {
          res.send(200, orderMaster);
        } else {
          res.send(404, "Order Master not found");
        }
        return next();
      })
      .catch((error) => {
        console.error("Error getting order master by ID:", error);
        res.send(500, "Internal Server Error");
        return next();
      });
  }

  async update(req: Request, res: Response, next: Next) {
    const updateOrderMasterDTO: UpdateOrderMasterDTO = req.body;
    const orderMasterId: number = parseInt(req.params.id, 10);
    return orderMasterRepository
      .update(orderMasterId, updateOrderMasterDTO)
      .then((updatedOrderMaster) => {
        if (updatedOrderMaster) {
          res.send(200, updatedOrderMaster);
        } else {
          res.send(404, "Order Master not found");
        }
        return next();
      })
      .catch((error) => {
        console.error("Error updating order master:", error);
        res.send(500, "Internal Server Error");
        return next();
      });
  }

  async delete(req: Request, res: Response, next: Next) {
    const orderMasterId: number = parseInt(req.params.id, 10);
    return orderMasterRepository
      .delete(orderMasterId)
      .then((rowsAffected) => {
        if (rowsAffected > 0) {
          res.send(204);
        } else {
          res.send(404, "Order Master not found");
        }
        return next();
      })
      .catch((error) => {
        console.error("Error deleting order master:", error);
        res.send(500, "Internal Server Error");
        return next();
      });
  }
}

export default new OrderMasterController();

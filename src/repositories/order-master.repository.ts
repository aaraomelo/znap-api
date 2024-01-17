import { ResultSetHeader } from "mysql2";
import connection from "../db";
import OrderMaster from "../models/order-master.model ";
import {
  CreateOrderMasterDTO,
  UpdateOrderMasterDTO,
} from "../dto/order-master.dto";

interface IOrderMasterRepository {
  save(order: CreateOrderMasterDTO): Promise<OrderMaster>;
  retrieveById(orderId: number): Promise<OrderMaster | undefined>;
  update(
    orderMasterId: number,
    updateOrderDTO: UpdateOrderMasterDTO
  ): Promise<OrderMaster>;
  delete(orderId: number): Promise<number>;
  deleteAll(): Promise<number>;
}

class OrderMasterRepository implements IOrderMasterRepository {
  save(createOrderDTO: CreateOrderMasterDTO): Promise<OrderMaster> {
    return new Promise((resolve, reject) => {
      connection.query<ResultSetHeader>(
        "INSERT INTO orders_master (date, order_number, client_id, total_amount) VALUES (?, ?, ?, ?)",
        [
          createOrderDTO.date,
          createOrderDTO.order_number,
          createOrderDTO.client_id,
          createOrderDTO.total_amount,
        ],
        (err, res) => {
          if (err) reject(err);
          else
            this.retrieveById(res.insertId)
              .then((savedOrder) => resolve(savedOrder!))
              .catch(reject);
        }
      );
    });
  }

  retrieveById(orderId: number): Promise<OrderMaster | undefined> {
    return new Promise((resolve, reject) => {
      connection.query<OrderMaster[]>(
        "SELECT * FROM orders_master WHERE id = ?",
        [orderId],
        (err, res) => {
          if (err) reject(err);
          else resolve(res?.[0]);
        }
      );
    });
  }

  update(
    orderMasterId: number,
    updateOrderDTO: UpdateOrderMasterDTO
  ): Promise<OrderMaster> {
    return new Promise((resolve, reject) => {
      connection.query<ResultSetHeader>(
        "UPDATE orders_master SET date = ?, order_number = ?, client_id = ?, total_amount = ? WHERE id = ?",
        [
          updateOrderDTO.date,
          updateOrderDTO.order_number,
          updateOrderDTO.client_id,
          updateOrderDTO.total_amount,
          orderMasterId,
        ],
        (err) => {
          if (err) reject(err);
          else
            this.retrieveById(orderMasterId)
              .then((updatedOrder) => resolve(updatedOrder!))
              .catch(reject);
        }
      );
    });
  }

  delete(orderId: number): Promise<number> {
    return new Promise((resolve, reject) => {
      connection.query<ResultSetHeader>(
        "DELETE FROM orders_master WHERE id = ?",
        [orderId],
        (err, res) => {
          if (err) reject(err);
          else resolve(res.affectedRows);
        }
      );
    });
  }

  deleteAll(): Promise<number> {
    return new Promise((resolve, reject) => {
      connection.query<ResultSetHeader>(
        "DELETE FROM order_master",
        (err, res) => {
          if (err) reject(err);
          else resolve(res.affectedRows);
        }
      );
    });
  }
}

export default new OrderMasterRepository();

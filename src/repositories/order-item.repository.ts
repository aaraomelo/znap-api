import { ResultSetHeader } from "mysql2";
import connection from "../db";
import { CreateOrderItemDTO, UpdateOrderItemDTO } from "../dto/order-item.dto";
import OrderItem from "../models/order-item.model";

interface IOrderItemRepository {
  save(orderItem: CreateOrderItemDTO): Promise<OrderItem>;
  retrieveById(orderItemId: number): Promise<OrderItem | undefined>;
  update(
    orderItemId: number,
    updateOrderItemDTO: UpdateOrderItemDTO
  ): Promise<OrderItem>;
  delete(orderItemId: number): Promise<number>;
  deleteAll(): Promise<number>;
}

class OrderItemRepository implements IOrderItemRepository {
  save(createOrderItemDTO: CreateOrderItemDTO): Promise<OrderItem> {
    return new Promise((resolve, reject) => {
      connection.query<ResultSetHeader>(
        "INSERT INTO order_items (order_master_id, product_id, quantity, price, discount_percentage, tax_percentage) VALUES (?, ?, ?, ?, ?, ?)",
        [
          createOrderItemDTO.order_master_id,
          createOrderItemDTO.product_id,
          createOrderItemDTO.quantity,
          createOrderItemDTO.price,
          createOrderItemDTO.discount_percentage,
          createOrderItemDTO.tax_percentage,
        ],
        (err, res) => {
          if (err) reject(err);
          else
            this.retrieveById(res.insertId)
              .then((savedOrderItem) => resolve(savedOrderItem!))
              .catch(reject);
        }
      );
    });
  }

  retrieveById(orderItemId: number): Promise<OrderItem | undefined> {
    return new Promise((resolve, reject) => {
      connection.query<OrderItem[]>(
        "SELECT * FROM order_items WHERE id = ?",
        [orderItemId],
        (err, res) => {
          if (err) reject(err);
          else resolve(res?.[0]);
        }
      );
    });
  }

  update(
    orderItemId: number,
    updateOrderItemDTO: UpdateOrderItemDTO
  ): Promise<OrderItem> {
    return new Promise((resolve, reject) => {
      connection.query<ResultSetHeader>(
        "UPDATE order_items SET order_master_id = ?, product_id = ?, quantity = ?, price = ?, discount_percentage = ?, tax_percentage = ? WHERE id = ?",
        [
          updateOrderItemDTO.order_master_id,
          updateOrderItemDTO.product_id,
          updateOrderItemDTO.quantity,
          updateOrderItemDTO.price,
          updateOrderItemDTO.discount_percentage,
          updateOrderItemDTO.tax_percentage,
          orderItemId,
        ],
        (err) => {
          if (err) reject(err);
          else
            this.retrieveById(orderItemId)
              .then((updatedOrderItem) => resolve(updatedOrderItem!))
              .catch(reject);
        }
      );
    });
  }

  delete(orderItemId: number): Promise<number> {
    return new Promise((resolve, reject) => {
      connection.query<ResultSetHeader>(
        "DELETE FROM order_items WHERE id = ?",
        [orderItemId],
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
        "DELETE FROM order_item",
        (err, res) => {
          if (err) reject(err);
          else resolve(res.affectedRows);
        }
      );
    });
  }
}

export default new OrderItemRepository();

import { RowDataPacket } from "mysql2";
import Client from "./client.model";
import OrderItem from "./order-item.model";

export default interface OrderMaster extends RowDataPacket {
  id: number;
  date: Date;
  order_number: number;
  client_id: number;
  total_amount: number;
  created_at: Date;
  updated_at: Date;
  client: Client;
  order_items?: OrderItem[];
}

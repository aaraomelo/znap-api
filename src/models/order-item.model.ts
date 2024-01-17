import { RowDataPacket } from "mysql2";

export default interface OrderItem extends RowDataPacket {
  id: number;
  order_master_id: number;
  product_id: number;
  quantity: number;
  discount_percentage: number;
  tax_percentage: number;
  created_at: Date;
  updated_at: Date;
}

import { RowDataPacket } from "mysql2";
import Product from "./product.model ";

export default interface ProductCategory extends RowDataPacket {
  id: number;
  description: string;
  is_active: boolean;
  products?: Product[];
}

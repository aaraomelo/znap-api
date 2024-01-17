import { RowDataPacket } from "mysql2";
import Product from "./product.model ";

export default interface ProductCategory extends RowDataPacket {
  id: number;
  name: string;
  description: string;
  is_active: boolean;
  products?: Product[];
}

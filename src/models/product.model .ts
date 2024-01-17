import { RowDataPacket } from "mysql2";
import ProductCategory from "./product-category.model";

export default interface Product extends RowDataPacket {
  id: number;
  name: string;
  description: string;
  price: number;
  stock_quantity: number;
  category_id: number;
  product_category: ProductCategory;
}

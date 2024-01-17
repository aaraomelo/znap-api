import { ResultSetHeader } from "mysql2";
import connection from "../db";
import { CreateProductDTO, UpdateProductDTO } from "../dto/product.dto";
import Product from "../models/product.model ";

interface IProductRepository {
  save(product: CreateProductDTO): Promise<Product>;
  retrieveById(productId: number): Promise<Product | undefined>;
  update(
    productId: number,
    updateProductDTO: UpdateProductDTO
  ): Promise<Product>;
  delete(productId: number): Promise<number>;
  deleteAll(): Promise<number>;
}

class ProductRepository implements IProductRepository {
  save(createProductDTO: CreateProductDTO): Promise<Product> {
    return new Promise((resolve, reject) => {
      connection.query<ResultSetHeader>(
        "INSERT INTO products (name, description, price, stock_quantity, category_id) VALUES (?, ?, ?, ?, ?)",
        [
          createProductDTO.name,
          createProductDTO.description,
          createProductDTO.price,
          createProductDTO.stock_quantity,
          createProductDTO.category_id,
        ],
        (err, res) => {
          if (err) reject(err);
          else
            this.retrieveById(res.insertId)
              .then((savedProduct) => resolve(savedProduct!))
              .catch(reject);
        }
      );
    });
  }

  retrieveById(productId: number): Promise<Product | undefined> {
    return new Promise((resolve, reject) => {
      connection.query<Product[]>(
        "SELECT * FROM products WHERE id = ?",
        [productId],
        (err, res) => {
          if (err) reject(err);
          else resolve(res?.[0]);
        }
      );
    });
  }

  update(
    productId: number,
    updateProductDTO: UpdateProductDTO
  ): Promise<Product> {
    return new Promise((resolve, reject) => {
      connection.query<ResultSetHeader>(
        "UPDATE products SET name = ?, description = ?, price = ?, stock_quantity = ?, category_id = ? WHERE id = ?",
        [
          updateProductDTO.name,
          updateProductDTO.description,
          updateProductDTO.price,
          updateProductDTO.stock_quantity,
          updateProductDTO.category_id,
          productId,
        ],
        (err) => {
          if (err) reject(err);
          else
            this.retrieveById(productId)
              .then((updatedProduct) => resolve(updatedProduct!))
              .catch(reject);
        }
      );
    });
  }

  delete(productId: number): Promise<number> {
    return new Promise((resolve, reject) => {
      connection.query<ResultSetHeader>(
        "DELETE FROM products WHERE id = ?",
        [productId],
        (err, res) => {
          if (err) reject(err);
          else resolve(res.affectedRows);
        }
      );
    });
  }

  deleteAll(): Promise<number> {
    return new Promise((resolve, reject) => {
      connection.query<ResultSetHeader>("DELETE FROM product", (err, res) => {
        if (err) reject(err);
        else resolve(res.affectedRows);
      });
    });
  }
}

export default new ProductRepository();

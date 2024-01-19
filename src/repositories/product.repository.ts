import { ResultSetHeader } from "mysql2";
import connection from "../db";
import { CreateProductDTO, UpdateProductDTO } from "../dto/product.dto";
import Product from "../models/product.model ";
import { filterClauses, formatObjectWithPrefix } from "../utils/db.utils";

interface IProductRepository {
  save(product: CreateProductDTO): Promise<Product>;
  retrieveById(productId: number): Promise<Product | undefined>;
  update(
    productId: number,
    updateProductDTO: UpdateProductDTO
  ): Promise<Product>;
  delete(productId: number): Promise<number>;
  deleteAll(): Promise<number>;
  getPaginated(
    page: number,
    itemsPerPage: number,
    filters: Record<string, any>,
    sortKey: string,
    sortOrder: "asc" | "desc"
  ): Promise<{ data: Product[]; page: number; total: number }>;
  count(filters: Record<string, any>): Promise<number>;
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

  getAutocomplete(
    key: string,
    value: string,
    limit: number
  ): Promise<{
    data: any;
  }> {
    const clauses = filterClauses({ [key]: value });
    return new Promise((resolve, reject) => {
      const query = `
        SELECT ${key} FROM product_categories AS category
        RIGHT JOIN products AS product ON category.id = product.category_id
        ${clauses ? `WHERE ${clauses}` : ""}
        ORDER BY ${key} ASC
      `;
      connection.query<Product[]>(query, (err, res) => {
        if (err) {
          reject(err);
        } else {
          const firstItem = res[0];
          const dynamicKey = firstItem ? Object.keys(firstItem)[0] : "";
          const values = [...new Set(res.map((item) => item[dynamicKey]))];
          resolve({
            data: values.slice(0, limit),
          });
        }
      });
    });
  }

  getPaginated(
    page: number,
    itemsPerPage: number,
    filters: Record<string, any>,
    sortKey: string,
    sortOrder: "asc" | "desc"
  ): Promise<{
    data: Product[];
    page: number;
    total: number;
    totalPages: number;
  }> {
    const offset = (page - 1) * itemsPerPage;
    const clauses = filterClauses(filters);
    return new Promise((resolve, reject) => {
      const query = `
        SELECT product.*, category.id AS category_id, category.name AS category_name, category.description AS category_description
        FROM product_categories AS category
        RIGHT JOIN products AS product ON category.id = product.category_id
        ${clauses ? `WHERE ${clauses}` : ""}
        ORDER BY ${sortKey} ${sortOrder}
        LIMIT ${itemsPerPage}
        OFFSET ${offset}
      `;
      connection.query<Product[]>(query, (err, res) => {
        if (err) {
          reject(err);
        } else {
          this.count(filters).then((total) => {
            const totalPages = Math.ceil(total / itemsPerPage);
            resolve({
              data: res.map(formatObjectWithPrefix("category_")),
              page,
              total,
              totalPages,
            });
          });
        }
      });
    });
  }

  count(filters: Record<string, any>): Promise<number> {
    const clauses = filterClauses(filters);
    return new Promise((resolve, reject) => {
      const query = `
        SELECT  COUNT(*) AS count
        FROM product_categories AS category
        RIGHT JOIN products AS product ON category.id = product.category_id
        ${clauses ? `WHERE ${clauses}` : ""}
      `;
      connection.query(query, (err: any, res: Array<{ count: number }>) => {
        if (err) {
          reject(err);
        } else {
          const count = res[0]?.count || 0;
          resolve(count);
        }
      });
    });
  }
}

export default new ProductRepository();

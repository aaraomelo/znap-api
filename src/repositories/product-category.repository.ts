import { ResultSetHeader } from "mysql2";
import connection from "../db";
import {
  CreateProductCategoryDTO,
  UpdateProductCategoryDTO,
} from "../dto/product-category.dto";
import ProductCategory from "../models/product-category.model";
import { filterClauses } from "../utils/db.utils";

interface IProductCategoryRepository {
  save(category: CreateProductCategoryDTO): Promise<ProductCategory>;
  retrieveById(categoryId: number): Promise<ProductCategory | undefined>;
  update(
    productCategoryId: number,
    updateCategoryDTO: UpdateProductCategoryDTO
  ): Promise<ProductCategory>;
  delete(categoryId: number): Promise<number>;
  deleteAll(): Promise<number>;
  getPaginated(
    page: number,
    itemsPerPage: number,
    filters: Record<string, any>,
    sortKey: string,
    sortOrder: "asc" | "desc"
  ): Promise<{ data: ProductCategory[]; page: number; total: number }>;
  count(filters: Record<string, any>): Promise<number>;
}

class ProductCategoryRepository implements IProductCategoryRepository {
  save(createCategoryDTO: CreateProductCategoryDTO): Promise<ProductCategory> {
    return new Promise((resolve, reject) => {
      connection.query<ResultSetHeader>(
        "INSERT INTO product_categories (name, description, is_active) VALUES (?, ?, ?)",
        [
          createCategoryDTO.name,
          createCategoryDTO.description,
          createCategoryDTO.is_active ?? true,
        ],
        (err, res) => {
          if (err) reject(err);
          else
            this.retrieveById(res.insertId)
              .then((savedCategory) => resolve(savedCategory!))
              .catch(reject);
        }
      );
    });
  }

  retrieveById(categoryId: number): Promise<ProductCategory | undefined> {
    return new Promise((resolve, reject) => {
      connection.query<ProductCategory[]>(
        "SELECT * FROM product_categories WHERE id = ?",
        [categoryId],
        (err, res) => {
          if (err) reject(err);
          else resolve(res?.[0]);
        }
      );
    });
  }

  update(
    productCategoryId: number,
    updateCategoryDTO: UpdateProductCategoryDTO
  ): Promise<ProductCategory> {
    return new Promise((resolve, reject) => {
      connection.query<ResultSetHeader>(
        "UPDATE product_categories SET name = ?, description = ?, is_active = ? WHERE id = ?",
        [
          updateCategoryDTO.name,
          updateCategoryDTO.description,
          updateCategoryDTO.is_active,
          productCategoryId,
        ],
        (err) => {
          if (err) reject(err);
          else
            this.retrieveById(productCategoryId)
              .then((updatedCategory) => resolve(updatedCategory!))
              .catch(reject);
        }
      );
    });
  }

  delete(categoryId: number): Promise<number> {
    return new Promise((resolve, reject) => {
      connection.query<ResultSetHeader>(
        "DELETE FROM product_categories WHERE id = ?",
        [categoryId],
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
        "DELETE FROM product_category",
        (err, res) => {
          if (err) reject(err);
          else resolve(res.affectedRows);
        }
      );
    });
  }

  getPaginated(
    page: number,
    itemsPerPage: number,
    filters: Record<string, any>,
    sortKey: string,
    sortOrder: "asc" | "desc"
  ): Promise<{
    data: ProductCategory[];
    page: number;
    total: number;
    totalPages: number;
  }> {
    const offset = (page - 1) * itemsPerPage;
    const clauses = filterClauses(filters);
    return new Promise((resolve, reject) => {
      const query = `
        SELECT category.* 
        FROM product_categories AS category
        ${clauses ? `WHERE ${clauses}` : ""}
        ORDER BY ${sortKey} ${sortOrder}
        LIMIT ${itemsPerPage}
        OFFSET ${offset}
      `;
      connection.query<ProductCategory[]>(query, (err, res) => {
        if (err) {
          reject(err);
        } else {
          this.count(filters).then((total) => {
            const totalPages = Math.ceil(total / itemsPerPage);
            resolve({
              data: res,
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

export default new ProductCategoryRepository();

import { ResultSetHeader } from "mysql2";
import connection from "../db";
import {
  CreateProductCategoryDTO,
  UpdateProductCategoryDTO,
} from "../dto/product-category.dto";
import ProductCategory from "../models/product-category.model";

interface IProductCategoryRepository {
  save(category: CreateProductCategoryDTO): Promise<ProductCategory>;
  retrieveById(categoryId: number): Promise<ProductCategory | undefined>;
  update(
    productCategoryId: number,
    updateCategoryDTO: UpdateProductCategoryDTO
  ): Promise<ProductCategory>;
  delete(categoryId: number): Promise<number>;
  deleteAll(): Promise<number>;
}

class ProductCategoryRepository implements IProductCategoryRepository {
  save(createCategoryDTO: CreateProductCategoryDTO): Promise<ProductCategory> {
    return new Promise((resolve, reject) => {
      connection.query<ResultSetHeader>(
        "INSERT INTO product_categories (name, description, is_active) VALUES (?, ?, ?)",
        [createCategoryDTO.name, createCategoryDTO.description, createCategoryDTO.is_active ?? true],
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
}

export default new ProductCategoryRepository();

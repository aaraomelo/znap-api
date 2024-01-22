import { Next, Request, Response } from "restify";
import productCategoryRepository from "../repositories/product-category.repository";
import {
  CreateProductCategoryDTO,
  UpdateProductCategoryDTO,
} from "../dto/product-category.dto";
import { StatusCodes } from "http-status-codes";

class ProductCategoryController {
  async create(req: Request, res: Response, next: Next) {
    const createProductCategoryDTO: CreateProductCategoryDTO = req.body;
    return productCategoryRepository
      .save(createProductCategoryDTO)
      .then((createdProductCategory) => {
        res.send(201, createdProductCategory);
        return next();
      })
      .catch((error) => {
        console.error("Error creating product category:", error);
        res.send(500, "Internal Server Error");
        return next();
      });
  }

  async getById(req: Request, res: Response, next: Next) {
    const productCategoryId: number = parseInt(req.params.id, 10);
    return productCategoryRepository
      .retrieveById(productCategoryId)
      .then((productCategory) => {
        if (productCategory) {
          res.send(200, productCategory);
        } else {
          res.send(404, "Product Category not found");
        }
        return next();
      })
      .catch((error) => {
        console.error("Error getting product category by ID:", error);
        res.send(500, "Internal Server Error");
        return next();
      });
  }

  async update(req: Request, res: Response, next: Next) {
    const productCategoryId: number = parseInt(req.params.id, 10);
    const updateProductCategoryDTO: UpdateProductCategoryDTO = req.body;
    return productCategoryRepository
      .update(productCategoryId, updateProductCategoryDTO)
      .then((updatedProductCategory) => {
        if (updatedProductCategory) {
          res.send(200, updatedProductCategory);
        } else {
          res.send(404, "Product Category not found");
        }
        return next();
      })
      .catch((error) => {
        console.error("Error updating product category:", error);
        res.send(500, "Internal Server Error");
        return next();
      });
  }

  async delete(req: Request, res: Response, next: Next) {
    const productCategoryId: number = parseInt(req.params.id, 10);
    return productCategoryRepository
      .delete(productCategoryId)
      .then((rowsAffected) => {
        if (rowsAffected > 0) {
          res.send(204);
        } else {
          res.send(404, "Product Category not found");
        }
        return next();
      })
      .catch((error) => {
        console.error("Error deleting product category:", error);
        res.send(500, "Internal Server Error");
        return next();
      });
  }

  async getPaginated(req: Request, res: Response, next: Next) {
    try {
      const page: number = parseInt(req.query.page as string, 10) || 1;
      const itemsPerPage: number =
        parseInt(req.query.itemsPerPage as string, 10) || 10;
      const filters: Record<string, any> = {
        "category.name": req.query.name,
        "category.description": req.query.description,
        "category.is_active": req.query.isActive ?? "1",
      };

      const sortKey: string = req.query.sortKey || "id";
      const sortOrder: "asc" | "desc" =
        req.query.sortOrder === "desc" ? "desc" : "asc";
      const result = await productCategoryRepository.getPaginated(
        page,
        itemsPerPage,
        filters,
        sortKey,
        sortOrder
      );
      res.send(StatusCodes.OK, result);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.send(StatusCodes.INTERNAL_SERVER_ERROR, "Internal Server Error");
    } finally {
      next();
    }
  }
}

export default new ProductCategoryController();

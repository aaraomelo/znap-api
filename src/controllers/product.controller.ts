import { Next, Request, Response } from "restify";
import productRepository from "../repositories/product.repository";
import { CreateProductDTO, UpdateProductDTO } from "../dto/product.dto";
import { StatusCodes } from "http-status-codes";

class ProductController {
  async create(req: Request, res: Response, next: Next) {
    try {
      const createProductDTO: CreateProductDTO = req.body;
      const createdProduct = await productRepository.save(createProductDTO);

      res.send(StatusCodes.CREATED, createdProduct);
    } catch (error) {
      console.error("Error creating product:", error);
      res.send(StatusCodes.INTERNAL_SERVER_ERROR, "Internal Server Error");
    } finally {
      next();
    }
  }

  async getById(req: Request, res: Response, next: Next) {
    try {
      const productId: number = parseInt(req.params.id, 10);
      const product = await productRepository.retrieveById(productId);

      if (product) {
        res.send(StatusCodes.OK, product);
      } else {
        res.send(StatusCodes.NOT_FOUND, "Product not found");
      }
    } catch (error) {
      console.error("Error getting product by ID:", error);
      res.send(StatusCodes.INTERNAL_SERVER_ERROR, "Internal Server Error");
    } finally {
      next();
    }
  }

  async update(req: Request, res: Response, next: Next) {
    try {
      const updateProductDTO: UpdateProductDTO = req.body;
      const productId: number = parseInt(req.params.id, 10);
      const updatedProduct = await productRepository.update(
        productId,
        updateProductDTO
      );

      if (updatedProduct) {
        res.send(StatusCodes.OK, updatedProduct);
      } else {
        res.send(StatusCodes.NOT_FOUND, "Product not found");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      res.send(StatusCodes.INTERNAL_SERVER_ERROR, "Internal Server Error");
    } finally {
      next();
    }
  }

  async delete(req: Request, res: Response, next: Next) {
    try {
      const productId: number = parseInt(req.params.id, 10);
      const rowsAffected = await productRepository.delete(productId);

      if (rowsAffected > 0) {
        res.send(StatusCodes.NO_CONTENT);
      } else {
        res.send(StatusCodes.NOT_FOUND, "Product not found");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      res.send(StatusCodes.INTERNAL_SERVER_ERROR, "Internal Server Error");
    } finally {
      next();
    }
  }

  async getPaginated(req: Request, res: Response, next: Next) {
    try {
      const page: number = parseInt(req.query.page as string, 10) || 1;
      const itemsPerPage: number = parseInt(req.query.itemsPerPage as string, 10) || 10;
      const filters: Record<string, any> = {
        "product.name": req.query.name as string,
        "product.description": req.query.description as string,
        "category.name": req.query["category.name"] as string,
        "category.description": req.query["category.description"] as string,
      };
      const sortKey: string = (req.query.sortKey as string) || "id";
      const sortOrder: "asc" | "desc" =
        (req.query.sortOrder as string) === "desc" ? "desc" : "asc";
      const result = await productRepository.getPaginated(
        page,
        itemsPerPage,
        filters,
        sortKey,
        sortOrder
      );
      res.send(StatusCodes.OK, result);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.send(StatusCodes.INTERNAL_SERVER_ERROR, "Internal Server Error");
    } finally {
      next();
    }
  }
}

export default new ProductController();

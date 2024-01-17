import { Next, Request, Response } from "restify";
import productRepository from "../repositories/product.repository";
import { CreateProductDTO, UpdateProductDTO } from "../dto/product.dto";

class ProductController {
  async create(req: Request, res: Response, next: Next) {
    const createProductDTO: CreateProductDTO = req.body;
    return productRepository
      .save(createProductDTO)
      .then((createdProduct) => {
        res.send(201, createdProduct);
        return next();
      })
      .catch((error) => {
        console.error("Error creating product:", error);
        res.send(500, "Internal Server Error");
        return next();
      });
  }

  async getById(req: Request, res: Response, next: Next) {
    const productId: number = parseInt(req.params.id, 10);
    return productRepository
      .retrieveById(productId)
      .then((product) => {
        if (product) {
          res.send(200, product);
        } else {
          res.send(404, "Product not found");
        }
        return next();
      })
      .catch((error) => {
        console.error("Error getting product by ID:", error);
        res.send(500, "Internal Server Error");
        return next();
      });
  }

  async update(req: Request, res: Response, next: Next) {
    const updateProductDTO: UpdateProductDTO = req.body;
    const productId: number = parseInt(req.params.id, 10);
    return productRepository
      .update(productId, updateProductDTO)
      .then((updatedProduct) => {
        if (updatedProduct) {
          res.send(200, updatedProduct);
        } else {
          res.send(404, "Product not found");
        }
        return next();
      })
      .catch((error) => {
        console.error("Error updating product:", error);
        res.send(500, "Internal Server Error");
        return next();
      });
  }

  async delete(req: Request, res: Response, next: Next) {
    const productId: number = parseInt(req.params.id, 10);
    return productRepository
      .delete(productId)
      .then((rowsAffected) => {
        if (rowsAffected > 0) {
          res.send(204);
        } else {
          res.send(404, "Product not found");
        }
        return next();
      })
      .catch((error) => {
        console.error("Error deleting product:", error);
        res.send(500, "Internal Server Error");
        return next();
      });
  }
}

export default new ProductController();

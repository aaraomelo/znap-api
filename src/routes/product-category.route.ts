import { Server } from "restify";
import productCategoryController from "../controllers/product-category.controller";

const productCategoryRoutes = (server: Server) => {
  server.post("/product-categories", productCategoryController.create);
  server.get("/product-categories/:id", productCategoryController.getById);
  server.put("/product-categories/:id", productCategoryController.update);
  server.del("/product-categories/:id", productCategoryController.delete);
  server.get("/product-categories", productCategoryController.getPaginated);
};

export default productCategoryRoutes;

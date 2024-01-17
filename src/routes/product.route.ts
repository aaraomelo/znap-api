import { Server } from "restify";
import productController from "../controllers/product.controller";

const productRoutes = (server: Server) => {
  server.post("/products", productController.create);
  server.get("/products/:id", productController.getById);
  server.put("/products/:id", productController.update);
  server.del("/products/:id", productController.delete);
};

export default productRoutes;

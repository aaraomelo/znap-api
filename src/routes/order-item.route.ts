import { Server } from "restify";
import orderItemController from "../controllers/order-item.controller";

const orderItemRoutes = (server: Server) => {
  server.post("/order-items", orderItemController.create);
  server.get("/order-items/:id", orderItemController.getById);
  server.put("/order-items/:id", orderItemController.update);
  server.del("/order-items/:id", orderItemController.delete);
};

export default orderItemRoutes;
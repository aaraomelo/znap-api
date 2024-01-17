import { Server } from "restify";
import orderMasterController from "../controllers/order-master.controller";

const orderMasterRoutes = (server: Server) => {
  server.post("/order-masters", orderMasterController.create);
  server.get("/order-masters/:id", orderMasterController.getById);
  server.put("/order-masters/:id", orderMasterController.update);
  server.del("/order-masters/:id", orderMasterController.delete);
};

export default orderMasterRoutes;
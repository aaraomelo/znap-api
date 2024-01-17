import { Server } from "restify";
import clientController from "../controllers/client.controller";

const clientRoutes = (server: Server) => {
  server.post("/clients", clientController.create);
  server.get("/clients/:id", clientController.getById);
  server.put("/clients/:id", clientController.update);
  server.del("/clients/:id", clientController.delete);
};

export default clientRoutes;


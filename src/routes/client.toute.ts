import { Server } from "restify";
import clientsController from "../controllers/clients.controller";

const clientsRoutes = (server: Server) => {
  server.post('/client', clientsController.create);
};

export default clientsRoutes;
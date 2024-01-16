import { Next, Request, Response } from "restify";
import Client from "../models/client.model";
import clientRepository from "../repositories/client.repository";

class ClientsController {
  async create(req: Request, res: Response, next: Next) {
    try {
      const client: Client = req.body;
      const createdClient = await clientRepository.save(client);
      res.send(201, createdClient);
      return next();
    } catch (error) {
      console.error("Error creating client:", error);
      res.send(500, "Internal Server Error");
      return next();
    }
  }
}

export default new ClientsController();
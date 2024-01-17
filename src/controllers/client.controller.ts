import { Next, Request, Response } from "restify";
import clientRepository from "../repositories/client.repository";
import { CreateClientDTO, UpdateClientDTO } from "../dto/client.dto";

class ClientController {
  async create(req: Request, res: Response, next: Next) {
    const createClientDTO: CreateClientDTO = req.body;
    return clientRepository
      .save(createClientDTO)
      .then((createdClient) => {
        res.send(201, createdClient);
        return next();
      })
      .catch((error) => {
        console.error("Error creating client:", error);
        res.send(500, "Internal Server Error");
        return next();
      });
  }

  async getById(req: Request, res: Response, next: Next) {
    const clientId: number = parseInt(req.params.id, 10);
    return clientRepository
      .retrieveById(clientId)
      .then((client) => {
        if (client) {
          res.send(200, client);
        } else {
          res.send(404, "Client not found");
        }
        return next();
      })
      .catch((error) => {
        console.error("Error getting client by ID:", error);
        res.send(500, "Internal Server Error");
        return next();
      });
  }

  async update(req: Request, res: Response, next: Next) {
    const clientId: number = parseInt(req.params.id, 10);
    const updateClientDTO: UpdateClientDTO = req.body;
    return clientRepository
      .update(clientId, updateClientDTO)
      .then((updatedClient) => {
        if (updatedClient) {
          res.send(200, updatedClient);
        } else {
          res.send(404, "Client not found");
        }
        return next();
      })
      .catch((error) => {
        console.error("Error updating client:", error);
        res.send(500, "Internal Server Error");
        return next();
      });
  }

  async delete(req: Request, res: Response, next: Next) {
    const clientId: number = parseInt(req.params.id, 10);
    return clientRepository
      .delete(clientId)
      .then((rowsAffected) => {
        if (rowsAffected > 0) {
          res.send(204);
        } else {
          res.send(404, "Client not found");
        }
        return next();
      })
      .catch((error) => {
        console.error("Error deleting client:", error);
        res.send(500, "Internal Server Error");
        return next();
      });
  }
}

export default new ClientController();

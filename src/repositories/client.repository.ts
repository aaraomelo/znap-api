import { ResultSetHeader } from "mysql2";
import connection from "../db";
import Client from "../models/client.model";
import { CreateClientDTO, UpdateClientDTO } from "../dto/client.dto";

interface IClientRepository {
  save(client: CreateClientDTO): Promise<Client>;
  retrieveById(clientId: number): Promise<Client | undefined>;
  update(clientId: number, updateClientDTO: UpdateClientDTO): Promise<Client>;
  delete(clientId: number): Promise<number>;
  deleteAll(): Promise<number>;
}

class ClientRepository implements IClientRepository {
  save(createClientDTO: CreateClientDTO): Promise<Client> {
    return new Promise((resolve, reject) => {
      connection.query<ResultSetHeader>(
        "INSERT INTO clients (name, email, phone_number) VALUES (?, ?, ?)",
        [
          createClientDTO.name,
          createClientDTO.email,
          createClientDTO.phone_number,
        ],
        (err, res) => {
          if (err) reject(err);
          else
            this.retrieveById(res.insertId)
              .then((savedClient) => resolve(savedClient!))
              .catch(reject);
        }
      );
    });
  }

  retrieveById(clientId: number): Promise<Client | undefined> {
    return new Promise((resolve, reject) => {
      connection.query<Client[]>(
        "SELECT * FROM client WHERE id = ?",
        [clientId],
        (err, res) => {
          if (err) reject(err);
          else resolve(res?.[0]);
        }
      );
    });
  }

  update(clientId: number, updateClientDTO: UpdateClientDTO): Promise<Client> {
    return new Promise((resolve, reject) => {
      connection.query<ResultSetHeader>(
        "UPDATE client SET name = ?, email = ?, phone_number = ? WHERE id = ?",
        [
          updateClientDTO.name,
          updateClientDTO.email,
          updateClientDTO.phone_number,
          clientId,
        ],
        (err) => {
          if (err) reject(err);
          else
            this.retrieveById(clientId)
              .then((updatedClient) => resolve(updatedClient!))
              .catch(reject);
        }
      );
    });
  }

  delete(clientId: number): Promise<number> {
    return new Promise((resolve, reject) => {
      connection.query<ResultSetHeader>(
        "DELETE FROM client WHERE id = ?",
        [clientId],
        (err, res) => {
          if (err) reject(err);
          else resolve(res.affectedRows);
        }
      );
    });
  }

  deleteAll(): Promise<number> {
    return new Promise((resolve, reject) => {
      connection.query<ResultSetHeader>("DELETE FROM client", (err, res) => {
        if (err) reject(err);
        else resolve(res.affectedRows);
      });
    });
  }
}

export default new ClientRepository();

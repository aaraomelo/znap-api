import { ResultSetHeader } from "mysql2";
import connection from "../db";
import Client from "../models/client.model";

interface IClientRepository {
  save(client: Client): Promise<Client>;
  retrieveById(clientId: number): Promise<Client | undefined>;
  update(client: Client): Promise<number>;
  delete(clientId: number): Promise<number>;
  deleteAll(): Promise<number>;
}

class ClientRepository implements IClientRepository {
  save(client: Client): Promise<Client> {
    return new Promise((resolve, reject) => {
      connection.query<ResultSetHeader>(
        "INSERT INTO clients (name, email) VALUES(?,?)",
        [client.name, client.email],
        (err, res) => {
          if (err) reject(err);
          else
            this.retrieveById(res.insertId)
              .then((clients) => resolve(clients!))
              .catch(reject);
        }
      );
    });
  }

  retrieveById(clientId: number): Promise<Client> {
    return new Promise((resolve, reject) => {
      connection.query<Client[]>(
        "SELECT * FROM clients WHERE id = ?",
        [clientId],
        (err, res) => {
          if (err) reject(err);
          else resolve(res?.[0]);
        }
      );
    });
  }

  update(client: Client): Promise<number> {
    return new Promise((resolve, reject) => {
      connection.query<ResultSetHeader>(
        "UPDATE clients SET name = ?, email = ? WHERE id = ?",
        [client.name, client.email, client.id],
        (err, res) => {
          if (err) reject(err);
          else resolve(res.affectedRows);
        }
      );
    });
  }

  delete(clientId: number): Promise<number> {
    return new Promise((resolve, reject) => {
      connection.query<ResultSetHeader>(
        "DELETE FROM clients WHERE id = ?",
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
      connection.query<ResultSetHeader>("DELETE FROM clients", (err, res) => {
        if (err) reject(err);
        else resolve(res.affectedRows);
      });
    });
  }
}

export default new ClientRepository();

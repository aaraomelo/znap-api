import { RowDataPacket } from "mysql2"

export default interface Client extends RowDataPacket {
  id?: number;
  name?: string;
  email?: string;
}

import { RowDataPacket } from "mysql2";
import OrderMaster from "./order-master.model ";

export default interface Client extends RowDataPacket {
  id: number;
  name: string;
  email: string;
  phone_number?: string;
  orders?: OrderMaster[];
}

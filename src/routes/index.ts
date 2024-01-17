import { Server } from "restify";
import clientRoutes from "./client.route";
import productRoutes from "./product.route";
import productCategoryRoutes from "./product-category.route";
import orderMasterRoutes from "./order-master.route";
import orderItemRoutes from "./order-item.route";

export default (server: Server) => {
    clientRoutes(server);
    productRoutes(server);
    productCategoryRoutes(server);
    orderItemRoutes(server);
}
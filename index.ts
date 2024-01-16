import { createServer, Server, plugins } from "restify";
import { environment } from "./src/config/environment";
import clientsRoutes from "./src/routes/client.toute";

const initApp = async () => {
  const app: Server = createServer({
    name: "api.restify",
    version: "1.0.0",
  });
  app.use(plugins.bodyParser());

  await clientsRoutes(app);
  try {
    app.listen(environment.PORT, () => {
      console.info(
        `The server is running on the port: HTTP - ${environment.PORT}`
      );
    });
  } catch (err) {
    console.error(`Server cannot be started | ${err}`);
    process.exit(2);
  }
};
initApp();

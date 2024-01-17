import { createServer, Server, plugins } from "restify";
import { environment } from "./src/config/environment";
import routes from "./src/routes";

const initApp = async () => {
  const app: Server = createServer({
    name: "api.restify",
    version: "1.0.0",
  });

  app.use(plugins.queryParser());
  app.use(plugins.bodyParser());

  await routes(app);

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

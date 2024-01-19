import { createServer, Server, plugins } from "restify";
import { environment } from "./src/config/environment";
import routes from "./src/routes";
import corsMiddleware from "restify-cors-middleware";

const initApp = async () => {
  const app: Server = createServer({
    name: "api.restify",
    version: "1.0.0",
  });

  const cors = corsMiddleware({
    origins: ["*"],  
    allowHeaders: ["*"],
    exposeHeaders: ["*"],
  });

  app.pre(cors.preflight);
  app.use(cors.actual);

  app.use(plugins.queryParser());
  app.use(plugins.bodyParser());
  
  app.use((req, res, next) => {
    res.header("Content-Type", "application/json; charset=utf-8");
    next();
  });
  
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
import { createServer, Server } from "restify";
import { environment } from "./config/environment";

const initApp = async () => {
  const app: Server = createServer({
    name: "api.restify",
    version: "1.0.0",
  });
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

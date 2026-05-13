import { defineSsrMiddleware } from "#q-app";
import backendApp from "backend";

export default defineSsrMiddleware(({ app }) => {
  app.route("/", backendApp);
});

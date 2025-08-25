import { env } from "./env";
import { buildApp } from "./app";

const app = buildApp();

app
  .listen({ port: env.PORT, host: "0.0.0.0" })
  .then((addr) =>
    app.log.info(`HTTP server running on ${addr} [${env.NODE_ENV}]`),
  )
  .catch((err) => {
    app.log.error(err);
    process.exit(1);
  });

import Fastify from "fastify";
import cors from "@fastify/cors";
import { releaseRoutes } from "./routes/releases";

export const buildServer = () => {
  const app = Fastify({ logger: true });

  app.register(cors, { origin: true });

  app.setErrorHandler((error, _request, reply) => {
    app.log.error(error);
    const status = error.statusCode ?? 500;
    reply.status(status).send({ error: error.message });
  });

  app.get("/api/health", async () => ({ status: "ok" }));
  app.register(releaseRoutes, { prefix: "/api/releases" });

  return app;
};

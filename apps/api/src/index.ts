import { buildServer } from "./server";

const port = Number(process.env.PORT ?? 3001);

const start = async () => {
  const app = buildServer();
  try {
    await app.listen({ port, host: "0.0.0.0" });
    app.log.info(`API running on ${port}`);
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
};

start();

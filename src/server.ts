import app from "./app";
import { prisma } from "./config/db.connection";
import { systemLogger } from "./utils/logger.util";

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  systemLogger.info(`🚀 Server is running smoothly on port ${PORT}`);
  systemLogger.info(
    `👉 Check health at: http://localhost:${PORT}/api/v1/health`,
  );
  console.log(`🚀 Server is running smoothly on port ${PORT}`);
  console.log(`👉 Check health at: http://localhost:${PORT}/api/v1/health`);
});

process.on("SIGTERM", async () => {
  systemLogger.info("SIGTERM signal received: closing HTTP server");
  server.close(async () => {
    await prisma.$disconnect();
    systemLogger.info("HTTP server closed, database disconnected");
    process.exit(0);
  });
});

import "dotenv/config";
import { randomUUID } from "node:crypto";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";
import analysisRoutes from "./routes/analysisRoutes.js";

const app = express();

app.use(helmet());

app.use(cors({
  origin: process.env.CLIENT_ORIGIN || "http://localhost:5173"
}));

app.use((req, res, next) => {
  req.requestId = randomUUID();
  res.setHeader("X-Request-ID", req.requestId);
  next();
});

app.use(express.json({ limit: "200kb" }));

app.use("/api", rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 120,
  standardHeaders: true,
  legacyHeaders: false
}));

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "HireSmart AI API",
    timestamp: new Date().toISOString()
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/resumes", resumeRoutes);
app.use("/api/analysis", analysisRoutes);

app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
    requestId: req.requestId
  });
});

// Centralized, safe error handling
app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);

  let status = Number(err.statusCode || err.status) || 500;
  let message = "Internal server error";

  if (err.name === "MulterError") {
    status = err.code === "LIMIT_FILE_SIZE" ? 413 : 400;
    message = status === 413
      ? "Uploaded file exceeds the allowed size."
      : "Invalid file upload.";
  } else if (err.type === "entity.parse.failed") {
    status = 400;
    message = "Invalid JSON request body.";
  } else if (status >= 400 && status < 500) {
    message = err.message || "Invalid request.";
  } else {
    status = 500;
  }

  console.error({
    requestId: req.requestId,
    status,
    error: err.message,
    timestamp: new Date().toISOString()
  });

  res.status(status).json({
    message,
    requestId: req.requestId
  });
});

const port = process.env.PORT || 5000;

connectDB()
  .then(() => {
    const server = app.listen(port, () => {
      console.log(`HireSmart API running on port ${port}`);
    });

    const shutdown = (signal) => {
      console.log(`${signal} received. Closing HTTP server...`);

      const forceExit = setTimeout(() => {
        console.error("Graceful shutdown timed out.");
        process.exit(1);
      }, 10000);

      forceExit.unref();

      server.close(() => {
        clearTimeout(forceExit);
        console.log("HTTP server closed.");
        process.exit(0);
      });
    };

    process.once("SIGINT", () => shutdown("SIGINT"));
    process.once("SIGTERM", () => shutdown("SIGTERM"));
  })
  .catch((err) => {
    console.error("Startup failed:", err.message);
    process.exit(1);
  });

import fastify from "fastify";
import cors from "@fastify/cors";
import { memoriesRoutes } from "./routes/memories";
import "dotenv/config";
import jwt from "@fastify/jwt";
import multipart from "@fastify/multipart";

import { authRoutes } from "./routes/auth";
import { uploadRoutes } from "./routes/upload";
import { resolve } from "node:path";

const app = fastify();

app.register(multipart);
app.register(require("@fastify/static"), {
  root: resolve(__dirname, "../uploads"),
  prefix: "/uploads",
});
app.register(cors, { origin: true }); // or the addresses that can access the API
app.register(jwt, { secret: "gnrm05g3498rhn49h8hcrhc3h8c83hc8389jc9983j" });
app.register(memoriesRoutes);
app.register(authRoutes);
app.register(uploadRoutes);

app.listen({ port: 3333, host: "0.0.0.0" }).then(() => {
  console.log("🚀️ HTTP server running on http://localhost:3333");
});

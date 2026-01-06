import express from "express";
import cors from "cors";
import reportRoutes from "./routes/report.routes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/report", reportRoutes);

export default app;

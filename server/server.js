import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import noteRoutes from "./routes/note.routes.js";
import { connectDB } from "./config/db.js";
import { errorHandler } from "./middlewares/error.middleware.js";

dotenv.config();

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL || "*" }));
app.use(express.json());
app.use(morgan("dev"));

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/edunotes_db";

await connectDB(MONGO_URI);

app.get("/", (req, res) => res.send("EduNotes API is running"));
app.use("/api/notes", noteRoutes);

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

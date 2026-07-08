import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route.js";
import gymRoutes from "./routes/gym.route.js";
import equipmentRoutes from "./routes/equipment.route.js";

dotenv.config();

console.log("DATABASE:",process.env.DATABASE_URL);

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());
app.use(cookieParser());

app.use((req, res, next) => {
    console.log(req.method, req.originalUrl);
    next();
});


app.use("/api/auth", authRoutes);
app.use("/api/gym", gymRoutes);
app.use("/api/equipment", equipmentRoutes)


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});
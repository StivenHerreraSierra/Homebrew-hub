import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import rutas from "./routes/routes.js";

dotenv.config();

const app = express();

app.use(cors({
    origin: '*'
}));

app.use("/api", rutas);

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Servidor escuchando en el puerto ${PORT}`));

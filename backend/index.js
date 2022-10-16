import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import rutas from './src/routes/routes.js';

// Recuperar las variables de .env
dotenv.config();

// Creación del servidor.
const app = express();

// Configuración del cors.
app.use(cors({
  origin: '*',
}));

// Definición de la ruta encargada de las peticiones hacia /api.
app.use('/api', rutas);

// Arrancando el servidor.
const { PORT } = process.env;
app.listen(PORT, () => console.log(`Servidor escuchando en el puerto ${PORT}`));

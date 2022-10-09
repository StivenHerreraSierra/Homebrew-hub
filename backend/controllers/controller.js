import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const httpClient = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

const END_POINT = process.env.API;

const obtenerPaquetes = async (req, res) => {
  const paquetes = await httpClient.get(`${END_POINT}/formula.json`);

  res.status(200).json(paquetes.data);
};

const obtenerAnaliticasMac = async (req, res) => {
  const { dias } = req.params;
  const analiticas = await httpClient.get(
    `${END_POINT}/analytics/install/${dias}.json`
  );

  res.status(200).json(analiticas.data);
};

const obtenerAnaliticasLinux = async (req, res) => {
  const { dias } = req.params;
  const analiticas = await httpClient.get(
    `${END_POINT}/analytics-linux/install/${dias}.json`
  );
  res.status(200).json(analiticas.data);
};

export {
    obtenerPaquetes,
    obtenerAnaliticasMac,
    obtenerAnaliticasLinux
};

const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const conexion = require("./conexion");

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use("/api", require("./api/planes"));

app.use("/api", require("./api/auth"));

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("Servidor backend funcionando 🚀");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🔥 Servidor corriendo en puerto ${PORT}`);
});



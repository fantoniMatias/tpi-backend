const express = require("express");
const router = express.Router();
const conexion = require("../conexion");

// LISTAR UBICACIONES (tabla auxiliar de solo lectura)
router.get("/ubicaciones", (req, res) => {
  conexion.query("SELECT * FROM ubicaciones", (error, results) => {
    if (error) {
      return res.status(500).json({ error: "Error en la consulta" });
    }

    res.json(results);
  });
});

module.exports = router;

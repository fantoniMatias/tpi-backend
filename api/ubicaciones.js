const express = require("express");
const router = express.Router();
const conexion = require("../conexion");

/**
 * @api {get} /ubicaciones Listar ubicaciones
 * @apiName ListarUbicaciones
 * @apiGroup Ubicaciones
 * @apiDescription Ruta pública. Tabla auxiliar de solo lectura (no cuenta para el mínimo de tablas).
 *
 * @apiSuccess {Object[]} ubicaciones Lista de ubicaciones (id_ubicacion, ciudad, pais, codigo_pais).
 */
router.get("/ubicaciones", (req, res) => {
  conexion.query("SELECT * FROM ubicaciones", (error, results) => {
    if (error) {
      return res.status(500).json({ error: "Error en la consulta" });
    }

    res.json(results);
  });
});

module.exports = router;

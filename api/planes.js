const express = require("express");
const router = express.Router();
const conexion = require("../conexion");
const { verificarToken, soloAdmin } = require("../middleware/authMiddleware");

/* ======================================================
   GET - LISTAR TODOS LOS PLANES
   Endpoint: GET /api/planes
====================================================== */
router.get("/planes", (req, res) => {
  conexion.query("SELECT * FROM planes", (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: "Error en la consulta" });
    }

    res.json(results);
  });
});


/* ======================================================
   GET - OBTENER UN PLAN POR ID
   Endpoint: GET /api/planes/:id
====================================================== */
router.get("/planes/:id", (req, res) => {
  const id = req.params.id;

  const sql = "SELECT * FROM planes WHERE id_plan = ?";

  conexion.query(sql, [id], (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: "Error en la consulta" });
    }

    if (results.length === 0) {
      return res.status(404).json({ mensaje: "Plan no encontrado" });
    }

    res.json(results[0]);
  });
});


/* ======================================================
   POST - CREAR NUEVO PLAN
   Endpoint: POST /api/planes
====================================================== */
router.post("/planes", verificarToken, soloAdmin, (req, res) => {
  const { nombre, ram_gb, cpu_cores, almacenamiento_gb, precio } = req.body;

  const sql = `
    INSERT INTO planes (nombre, ram_gb, cpu_cores, almacenamiento_gb, precio)
    VALUES (?, ?, ?, ?, ?)
  `;

  conexion.query(
    sql,
    [nombre, ram_gb, cpu_cores, almacenamiento_gb, precio],
    (error, result) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: "Error al insertar plan" });
      }

      res.status(201).json({
        mensaje: "Plan creado correctamente",
        id_plan: result.insertId
      });
    }
  );
});


/* ======================================================
   PUT - ACTUALIZAR PLAN POR ID
   Endpoint: PUT /api/planes/:id
====================================================== */
router.put("/planes/:id", verificarToken, soloAdmin, (req, res) => {
  const id = req.params.id;
  const { nombre, ram_gb, cpu_cores, almacenamiento_gb, precio } = req.body;

  const sql = `
    UPDATE planes 
    SET nombre = ?, ram_gb = ?, cpu_cores = ?, almacenamiento_gb = ?, precio = ?
    WHERE id_plan = ?
  `;

  conexion.query(
    sql,
    [nombre, ram_gb, cpu_cores, almacenamiento_gb, precio, id],
    (error, result) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: "Error al actualizar plan" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ mensaje: "Plan no encontrado" });
      }

      res.json({ mensaje: "Plan actualizado correctamente" });
    }
  );
});


/* ======================================================
   DELETE - ELIMINAR PLAN POR ID
   Endpoint: DELETE /api/planes/:id
====================================================== */
router.delete("/planes/:id", verificarToken, soloAdmin, (req, res) => {
  const id = req.params.id;

  const sql = "DELETE FROM planes WHERE id_plan = ?";

  conexion.query(sql, [id], (error, result) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: "Error al eliminar plan" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: "Plan no encontrado" });
    }

    res.json({ mensaje: "Plan eliminado correctamente" });
  });
});


module.exports = router;


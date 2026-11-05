const express = require("express");
const router = express.Router();
const conexion = require("../conexion");
const { verificarToken, soloAdmin, duenoOAdmin } = require("../middleware/authMiddleware");

// Une cada servidor con su dueño, su plan y su ubicación
const SELECT_SERVIDOR = `
  SELECT s.*, u.username AS propietario, p.nombre AS plan, p.ram_gb,
         p.almacenamiento_gb, p.max_jugadores, p.precio, ub.ciudad
  FROM servidores s
  JOIN usuarios u ON s.id_usuario = u.id_usuario
  JOIN planes p ON s.id_plan = p.id_plan
  LEFT JOIN ubicaciones ub ON s.id_ubicacion = ub.id_ubicacion
`;

// LISTAR TODOS (admin)
router.get("/servidores", verificarToken, soloAdmin, (req, res) => {
  conexion.query(SELECT_SERVIDOR, (error, results) => {
    if (error) {
      return res.status(500).json({ error: "Error en la consulta" });
    }

    res.json(results);
  });
});

// LISTAR MIS SERVIDORES. Va antes de /servidores/:id
router.get("/servidores/mios", verificarToken, (req, res) => {
  const sql = `${SELECT_SERVIDOR} WHERE s.id_usuario = ?`;

  conexion.query(sql, [req.usuario.id], (error, results) => {
    if (error) {
      return res.status(500).json({ error: "Error en la consulta" });
    }

    res.json(results);
  });
});

// OBTENER UNO
router.get("/servidores/:id", verificarToken, duenoOAdmin, (req, res) => {
  const sql = `${SELECT_SERVIDOR} WHERE s.id_servidor = ?`;

  conexion.query(sql, [req.params.id], (error, results) => {
    if (error) {
      return res.status(500).json({ error: "Error en la consulta" });
    }

    res.json(results[0]);
  });
});

// CREAR
router.post("/servidores", verificarToken, (req, res) => {
  const { nombre_servidor, id_plan, edicion, tipo_software, version, id_ubicacion } = req.body;

  const sql = `
    INSERT INTO servidores
      (id_usuario, id_plan, nombre_servidor, ip, edicion, tipo_software, version, id_ubicacion)
    VALUES (?, ?, ?, 'play.nexushost.gg', ?, ?, ?, ?)
  `;
  const valores = [req.usuario.id, id_plan, nombre_servidor, edicion, tipo_software, version, id_ubicacion];

  conexion.query(sql, valores, (error, result) => {
    if (error) {
      return res.status(400).json({ mensaje: "No se pudo crear el servidor" });
    }

    res.status(201).json({ id_servidor: result.insertId });
  });
});

// CAMBIAR ESTADO (simula encender y apagar)
router.put("/servidores/:id", verificarToken, duenoOAdmin, (req, res) => {
  const sql = "UPDATE servidores SET estado = ? WHERE id_servidor = ?";

  conexion.query(sql, [req.body.estado, req.params.id], (error) => {
    if (error) {
      return res.status(500).json({ error: "Error al cambiar el estado" });
    }

    res.json({ mensaje: "Estado actualizado" });
  });
});

// ELIMINAR
router.delete("/servidores/:id", verificarToken, duenoOAdmin, (req, res) => {
  conexion.query("DELETE FROM servidores WHERE id_servidor = ?", [req.params.id], (error) => {
    if (error) {
      return res.status(500).json({ error: "Error al eliminar servidor" });
    }

    res.json({ mensaje: "Servidor eliminado" });
  });
});

module.exports = router;

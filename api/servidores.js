const express = require("express");
const router = express.Router();
const conexion = require("../conexion");
const { verificarToken, soloAdmin, duenoOAdmin } = require("../middleware/authMiddleware");

// Une cada servidor con su dueño, su plan y su ubicación.
// Si no tiene plan (personalizado) usa la RAM y el disco guardados en el servidor
const SELECT_SERVIDOR = `
  SELECT s.*, u.username AS propietario,
         IFNULL(p.nombre, 'Personalizado') AS plan,
         IFNULL(p.ram_gb, s.ram_gb) AS ram_gb,
         IFNULL(p.almacenamiento_gb, s.almacenamiento_gb) AS almacenamiento_gb,
         IFNULL(p.precio, s.ram_gb * 1500 + s.almacenamiento_gb * 50) AS precio,
         IFNULL(p.max_jugadores, s.ram_gb * 3) AS max_jugadores, ub.ciudad
  FROM servidores s
  JOIN usuarios u ON s.id_usuario = u.id_usuario
  LEFT JOIN planes p ON s.id_plan = p.id_plan
  LEFT JOIN ubicaciones ub ON s.id_ubicacion = ub.id_ubicacion
`;

/**
 * @apiDefine DuenoOAdmin
 * @apiPermission dueño del servidor o admin
 * @apiError (403) SinPermiso El servidor es de otro usuario.
 * @apiError (404) ServidorNoEncontrado No existe un servidor con ese id.
 */

/**
 * @api {get} /servidores Listar todos los servidores
 * @apiName ListarServidores
 * @apiGroup Servidores
 * @apiDescription Cada servidor viene con su dueño, su plan y su ubicación.
 * @apiUse Token
 * @apiUse Admin
 *
 * @apiSuccess {Object[]} servidores Lista de servidores.
 */
router.get("/servidores", verificarToken, soloAdmin, (req, res) => {
  conexion.query(SELECT_SERVIDOR, (error, results) => {
    if (error) {
      return res.status(500).json({ error: "Error en la consulta" });
    }

    res.json(results);
  });
});

/**
 * @api {get} /servidores/mios Listar mis servidores
 * @apiName MisServidores
 * @apiGroup Servidores
 * @apiDescription Servidores del usuario que inició sesión. Va antes de /servidores/:id
 * para que "mios" no se tome como un id.
 * @apiUse Token
 *
 * @apiSuccess {Object[]} servidores Lista de servidores del usuario.
 */
router.get("/servidores/mios", verificarToken, (req, res) => {
  const sql = `${SELECT_SERVIDOR} WHERE s.id_usuario = ?`;

  conexion.query(sql, [req.usuario.id], (error, results) => {
    if (error) {
      return res.status(500).json({ error: "Error en la consulta" });
    }

    res.json(results);
  });
});

/**
 * @api {get} /servidores/:id Obtener un servidor
 * @apiName ObtenerServidor
 * @apiGroup Servidores
 * @apiUse Token
 * @apiUse DuenoOAdmin
 *
 * @apiParam {Number} id Id del servidor.
 * @apiSuccess {Object} servidor Datos del servidor con su plan y ubicación. Si es personalizado,
 * plan = "Personalizado" y el precio se calcula con RAM x 1500 + disco x 50.
 */
router.get("/servidores/:id", verificarToken, duenoOAdmin, (req, res) => {
  const sql = `${SELECT_SERVIDOR} WHERE s.id_servidor = ?`;

  conexion.query(sql, [req.params.id], (error, results) => {
    if (error) {
      return res.status(500).json({ error: "Error en la consulta" });
    }

    res.json(results[0]);
  });
});

/**
 * @api {post} /servidores Crear un servidor
 * @apiName CrearServidor
 * @apiGroup Servidores
 * @apiDescription Se manda id_plan para un plan normal, o ram_gb y almacenamiento_gb para uno personalizado.
 * @apiUse Token
 *
 * @apiBody {String} nombre_servidor Nombre del servidor.
 * @apiBody {Number} [id_plan] Id del plan (vacío si es personalizado).
 * @apiBody {Number} [ram_gb] RAM elegida (solo personalizado).
 * @apiBody {Number} [almacenamiento_gb] Disco elegido (solo personalizado).
 * @apiBody {String="java","bedrock"} edicion Edición del juego.
 * @apiBody {String="vanilla","paper","forge","fabric"} tipo_software Software.
 * @apiBody {String} version Versión del juego.
 * @apiBody {Number} id_ubicacion Id de la ubicación.
 *
 * @apiSuccess (201) {Number} id_servidor Id del servidor creado.
 * @apiError (400) NoSeCreo Faltan datos o son inválidos.
 */
router.post("/servidores", verificarToken, (req, res) => {
  const { nombre_servidor, id_plan, edicion, tipo_software, version, id_ubicacion, ram_gb, almacenamiento_gb } = req.body;

  // Un servidor personalizado llega sin plan: va NULL y se guardan su RAM y su disco
  const sql = `
    INSERT INTO servidores
      (id_usuario, id_plan, nombre_servidor, ip, edicion, tipo_software, version, id_ubicacion, ram_gb, almacenamiento_gb)
    VALUES (?, ?, ?, 'play.nexushost.gg', ?, ?, ?, ?, ?, ?)
  `;
  const valores = [
    req.usuario.id, id_plan || null, nombre_servidor, edicion, tipo_software,
    version, id_ubicacion, ram_gb || null, almacenamiento_gb || null
  ];

  conexion.query(sql, valores, (error, result) => {
    if (error) {
      return res.status(400).json({ mensaje: "No se pudo crear el servidor" });
    }

    res.status(201).json({ id_servidor: result.insertId });
  });
});

/**
 * @api {put} /servidores/:id Encender o apagar un servidor
 * @apiName CambiarEstado
 * @apiGroup Servidores
 * @apiDescription Simulado: solo cambia el estado guardado en la base.
 * @apiUse Token
 * @apiUse DuenoOAdmin
 *
 * @apiParam {Number} id Id del servidor.
 * @apiBody {String="encendido","apagado"} estado Estado nuevo.
 * @apiSuccess {String} mensaje "Estado actualizado".
 */
router.put("/servidores/:id", verificarToken, duenoOAdmin, (req, res) => {
  const sql = "UPDATE servidores SET estado = ? WHERE id_servidor = ?";

  conexion.query(sql, [req.body.estado, req.params.id], (error) => {
    if (error) {
      return res.status(500).json({ error: "Error al cambiar el estado" });
    }

    res.json({ mensaje: "Estado actualizado" });
  });
});

/**
 * @api {delete} /servidores/:id Eliminar un servidor
 * @apiName EliminarServidor
 * @apiGroup Servidores
 * @apiUse Token
 * @apiUse DuenoOAdmin
 *
 * @apiParam {Number} id Id del servidor.
 * @apiSuccess {String} mensaje "Servidor eliminado".
 */
router.delete("/servidores/:id", verificarToken, duenoOAdmin, (req, res) => {
  conexion.query("DELETE FROM servidores WHERE id_servidor = ?", [req.params.id], (error) => {
    if (error) {
      return res.status(500).json({ error: "Error al eliminar servidor" });
    }

    res.json({ mensaje: "Servidor eliminado" });
  });
});

module.exports = router;

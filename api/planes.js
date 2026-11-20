const express = require("express");
const router = express.Router();
const conexion = require("../conexion");
const { verificarToken, soloAdmin } = require("../middleware/authMiddleware");

/**
 * @api {get} /planes Listar planes
 * @apiName ListarPlanes
 * @apiGroup Planes
 * @apiDescription Ruta pública. Devuelve todos los planes.
 *
 * @apiSuccess {Object[]} planes Lista de planes (id_plan, nombre, ram_gb, cpu_cores,
 * almacenamiento_gb, precio, max_jugadores, descripcion, recomendacion, imagen).
 */
router.get("/planes", (req, res) => {
  conexion.query("SELECT * FROM planes", (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: "Error en la consulta" });
    }

    res.json(results);
  });
});


/**
 * @api {get} /planes/:id Obtener un plan
 * @apiName ObtenerPlan
 * @apiGroup Planes
 * @apiDescription Ruta pública.
 *
 * @apiParam {Number} id Id del plan.
 * @apiSuccess {Object} plan Datos del plan.
 * @apiError (404) PlanNoEncontrado No existe un plan con ese id.
 */
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


/**
 * @apiDefine DatosPlan
 * @apiBody {String} nombre Nombre del plan.
 * @apiBody {Number} ram_gb RAM en GB.
 * @apiBody {Number} cpu_cores Núcleos de CPU.
 * @apiBody {Number} almacenamiento_gb Disco en GB.
 * @apiBody {Number} precio Precio por mes.
 * @apiBody {Number} max_jugadores Máximo de jugadores.
 * @apiBody {String} [descripcion] Descripción corta.
 * @apiBody {String} [imagen] Dirección de la imagen (ejemplo: /mobs/1.png).
 */

/**
 * @api {post} /planes Crear un plan
 * @apiName CrearPlan
 * @apiGroup Planes
 * @apiUse Token
 * @apiUse Admin
 * @apiUse DatosPlan
 *
 * @apiSuccess (201) {Number} id_plan Id del plan creado.
 */
router.post("/planes", verificarToken, soloAdmin, (req, res) => {
  const { nombre, ram_gb, cpu_cores, almacenamiento_gb, precio, max_jugadores, descripcion, imagen } = req.body;

  const sql = `
    INSERT INTO planes (nombre, ram_gb, cpu_cores, almacenamiento_gb, precio, max_jugadores, descripcion, imagen)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  conexion.query(
    sql,
    [nombre, ram_gb, cpu_cores, almacenamiento_gb, precio, max_jugadores, descripcion, imagen],
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


/**
 * @api {put} /planes/:id Editar un plan
 * @apiName EditarPlan
 * @apiGroup Planes
 * @apiUse Token
 * @apiUse Admin
 *
 * @apiParam {Number} id Id del plan.
 * @apiUse DatosPlan
 * @apiSuccess {String} mensaje "Plan actualizado correctamente".
 * @apiError (404) PlanNoEncontrado No existe un plan con ese id.
 */
router.put("/planes/:id", verificarToken, soloAdmin, (req, res) => {
  const id = req.params.id;
  const { nombre, ram_gb, cpu_cores, almacenamiento_gb, precio, max_jugadores, descripcion, imagen } = req.body;

  const sql = `
    UPDATE planes
    SET nombre = ?, ram_gb = ?, cpu_cores = ?, almacenamiento_gb = ?, precio = ?,
        max_jugadores = ?, descripcion = ?, imagen = ?
    WHERE id_plan = ?
  `;

  conexion.query(
    sql,
    [nombre, ram_gb, cpu_cores, almacenamiento_gb, precio, max_jugadores, descripcion, imagen, id],
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


/**
 * @api {delete} /planes/:id Eliminar un plan
 * @apiName EliminarPlan
 * @apiGroup Planes
 * @apiDescription No se puede eliminar un plan que tiene servidores creados.
 * @apiUse Token
 * @apiUse Admin
 *
 * @apiParam {Number} id Id del plan.
 * @apiSuccess {String} mensaje "Plan eliminado correctamente".
 * @apiError (404) PlanNoEncontrado No existe un plan con ese id.
 */
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


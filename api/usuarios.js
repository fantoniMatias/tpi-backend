const express = require("express");
const router = express.Router();
const conexion = require("../conexion");
const { verificarToken, soloAdmin } = require("../middleware/authMiddleware");

/**
 * @api {get} /usuarios Listar usuarios
 * @apiName ListarUsuarios
 * @apiGroup Usuarios
 * @apiDescription Devuelve los usuarios sin la contraseña.
 * @apiUse Token
 * @apiUse Admin
 *
 * @apiSuccess {Object[]} usuarios Lista de usuarios (id_usuario, username, email, rol).
 */
router.get("/usuarios", verificarToken, soloAdmin, (req, res) => {
  const sql = "SELECT id_usuario, username, email, rol FROM usuarios";

  conexion.query(sql, (error, results) => {
    if (error) {
      return res.status(500).json({ error: "Error en la consulta" });
    }

    res.json(results);
  });
});

/**
 * @api {put} /usuarios/:id Cambiar el rol de un usuario
 * @apiName CambiarRol
 * @apiGroup Usuarios
 * @apiUse Token
 * @apiUse Admin
 *
 * @apiParam {Number} id Id del usuario.
 * @apiBody {String="cliente","admin"} rol Rol nuevo.
 * @apiSuccess {String} mensaje "Rol actualizado".
 */
router.put("/usuarios/:id", verificarToken, soloAdmin, (req, res) => {
  const sql = "UPDATE usuarios SET rol = ? WHERE id_usuario = ?";

  conexion.query(sql, [req.body.rol, req.params.id], (error) => {
    if (error) {
      return res.status(500).json({ error: "Error al cambiar el rol" });
    }

    res.json({ mensaje: "Rol actualizado" });
  });
});

/**
 * @api {delete} /usuarios/:id Eliminar un usuario
 * @apiName EliminarUsuario
 * @apiGroup Usuarios
 * @apiDescription También se borran sus servidores. Un admin no puede eliminar su propia cuenta.
 * @apiUse Token
 * @apiUse Admin
 *
 * @apiParam {Number} id Id del usuario.
 * @apiSuccess {String} mensaje "Usuario eliminado".
 * @apiError (400) CuentaPropia Se intentó eliminar la propia cuenta.
 */
router.delete("/usuarios/:id", verificarToken, soloAdmin, (req, res) => {
  if (req.usuario.id === Number(req.params.id)) {
    return res.status(400).json({ mensaje: "No podés eliminar tu propia cuenta" });
  }

  conexion.query("DELETE FROM usuarios WHERE id_usuario = ?", [req.params.id], (error) => {
    if (error) {
      return res.status(500).json({ error: "Error al eliminar usuario" });
    }

    res.json({ mensaje: "Usuario eliminado" });
  });
});

module.exports = router;

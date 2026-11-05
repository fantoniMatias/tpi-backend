const express = require("express");
const router = express.Router();
const conexion = require("../conexion");
const { verificarToken, soloAdmin } = require("../middleware/authMiddleware");

// LISTAR USUARIOS (sin la contraseña)
router.get("/usuarios", verificarToken, soloAdmin, (req, res) => {
  const sql = "SELECT id_usuario, username, email, rol FROM usuarios";

  conexion.query(sql, (error, results) => {
    if (error) {
      return res.status(500).json({ error: "Error en la consulta" });
    }

    res.json(results);
  });
});

// CAMBIAR ROL
router.put("/usuarios/:id", verificarToken, soloAdmin, (req, res) => {
  const sql = "UPDATE usuarios SET rol = ? WHERE id_usuario = ?";

  conexion.query(sql, [req.body.rol, req.params.id], (error) => {
    if (error) {
      return res.status(500).json({ error: "Error al cambiar el rol" });
    }

    res.json({ mensaje: "Rol actualizado" });
  });
});

// ELIMINAR USUARIO
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

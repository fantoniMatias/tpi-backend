const jwt = require("jsonwebtoken");
const conexion = require("../conexion");

function verificarToken(req, res, next) {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(403).json({ mensaje: "Token requerido" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
    if (error) {
      return res.status(401).json({ mensaje: "Token inválido" });
    }

    req.usuario = decoded;
    next();
  });
}

function soloAdmin(req, res, next) {
  if (req.usuario.rol !== "admin") {
    return res.status(403).json({ mensaje: "Acceso solo para admin" });
  }

  next();
}

// Deja pasar al admin o al dueño del servidor
function duenoOAdmin(req, res, next) {
  const sql = "SELECT id_usuario FROM servidores WHERE id_servidor = ?";

  conexion.query(sql, [req.params.id], (error, results) => {
    if (error || results.length === 0) {
      return res.status(404).json({ mensaje: "Servidor no encontrado" });
    }

    if (req.usuario.rol !== "admin" && req.usuario.id !== results[0].id_usuario) {
      return res.status(403).json({ mensaje: "No tenés permiso" });
    }

    next();
  });
}

module.exports = { verificarToken, soloAdmin, duenoOAdmin };

const jwt = require("jsonwebtoken");

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

module.exports = { verificarToken, soloAdmin };
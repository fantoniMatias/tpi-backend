const express = require("express");
const router = express.Router();
const conexion = require("../conexion");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// LOGIN
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  const sql = "SELECT * FROM usuarios WHERE username = ?";

  conexion.query(sql, [username], async (error, results) => {
    if (error) {
      return res.status(500).json({ error: "Error en el servidor" });
    }

    if (results.length === 0) {
      return res.status(401).json({ mensaje: "Usuario no encontrado" });
    }

    const usuario = results[0];

    const validPassword = await bcrypt.compare(password, usuario.password);

    if (!validPassword) {
      return res.status(401).json({ mensaje: "Contraseña incorrecta" });
    }

    const token = jwt.sign(
      {
        id: usuario.id_usuario,
        rol: usuario.rol
      },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({
      mensaje: "Login exitoso",
      token
    });
  });
});

module.exports = router;
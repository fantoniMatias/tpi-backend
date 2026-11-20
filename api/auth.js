const express = require("express");
const router = express.Router();
const conexion = require("../conexion");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/**
 * Bloques que se repiten en varias rutas. Cada ruta los llama por su nombre (Token, Admin)
 *
 * @apiDefine Token
 * @apiHeader {String} Authorization Token del login: "Bearer &lt;token&gt;".
 * @apiError (401) TokenInvalido El token no es válido o venció.
 * @apiError (403) TokenRequerido No se mandó el token.
 */

/**
 * @apiDefine Admin
 * @apiPermission admin
 * @apiError (403) SoloAdmin El usuario no es admin.
 */

/**
 * @api {post} /login Iniciar sesión
 * @apiName Login
 * @apiGroup Autenticación
 * @apiDescription Acepta el nombre de usuario o el email. Devuelve un token JWT que se manda en las rutas privadas.
 *
 * @apiBody {String} username Nombre de usuario o email.
 * @apiBody {String} password Contraseña.
 *
 * @apiSuccess {String} token Token JWT.
 * @apiSuccess {Object} usuario Datos del usuario (username, email, rol).
 * @apiError (401) UsuarioNoEncontrado No existe el usuario o la contraseña es incorrecta.
 */
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Busca por usuario o por email: el mismo dato se compara con las dos columnas
  const sql = "SELECT * FROM usuarios WHERE username = ? OR email = ?";

  conexion.query(sql, [username, username], async (error, results) => {
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
      token,
      usuario: {
        username: usuario.username,
        email: usuario.email,
        rol: usuario.rol
      }
    });
  });
});

/**
 * @api {post} /registro Crear una cuenta
 * @apiName Registro
 * @apiGroup Autenticación
 * @apiDescription La contraseña se guarda hasheada con bcrypt. La cuenta nueva tiene rol "cliente".
 *
 * @apiBody {String} username Nombre de usuario.
 * @apiBody {String} email Email.
 * @apiBody {String} password Contraseña.
 *
 * @apiSuccess (201) {String} mensaje "Usuario registrado".
 * @apiError (400) FaltanDatos Falta algún campo.
 * @apiError (409) YaExiste El usuario o el email ya están registrados.
 */
router.post("/registro", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ mensaje: "Faltan datos" });
  }

  const passwordHasheada = await bcrypt.hash(password, 10);

  const sql = "INSERT INTO usuarios (username, email, password) VALUES (?, ?, ?)";

  conexion.query(sql, [username, email, passwordHasheada], (error) => {
    if (error) {
      if (error.code === "ER_DUP_ENTRY") {
        return res.status(409).json({ mensaje: "El usuario o email ya existe" });
      }
      return res.status(500).json({ error: "Error en el servidor" });
    }

    res.status(201).json({ mensaje: "Usuario registrado" });
  });
});

module.exports = router;
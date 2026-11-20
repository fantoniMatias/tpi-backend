# NexusHost – Backend

API REST de **NexusHost**, una plataforma **simulada** para crear y administrar servidores de Minecraft.
Proyecto individual de la Trayectoria Pedagógica Interdisciplinaria (TPI) – Programación IV.

> Todo es una simulación: no se crean servidores reales, no se cobra nada y no se envían mails.

## Tecnologías

- **Node.js** + **Express** – servidor y rutas
- **MySQL** (mysql2) – base de datos
- **bcryptjs** – contraseñas hasheadas
- **jsonwebtoken** – login con token JWT
- **dotenv** – variables de entorno
- **cors** – permite que el frontend consuma la API
- **apidoc** – documentación de la API

## Instalación

1. Clonar el repositorio e instalar las dependencias:
   ```bash
   npm install
   ```
2. Importar la base de datos `tpi_hosting` en phpMyAdmin con el archivo `sql/tpi_hosting.sql`.
3. Copiar `.env.example` como `.env` y completar los datos de la base y la clave del JWT.
4. Iniciar el servidor:
   ```bash
   npm run dev
   ```
   La API queda en `http://localhost:3000/api`.

## Scripts

| Comando | Qué hace |
|---|---|
| `npm run dev` | Inicia el servidor y lo reinicia solo al guardar cambios |
| `npm start` | Inicia el servidor |
| `npm run docs` | Genera la documentación de la API en `docs/` |

## Documentación de la API

Generada con [apidoc](https://apidocjs.com). Abrir `docs/index.html` en el navegador.
Para actualizarla después de cambiar una ruta: `npm run docs`.

## Estructura

```
api/            Rutas, una por tabla
  auth.js         login y registro
  planes.js       CRUD de planes
  servidores.js   CRUD de servidores
  usuarios.js     listar, cambiar rol y eliminar usuarios
  ubicaciones.js  tabla auxiliar de solo lectura
middleware/
  authMiddleware.js   verificarToken, soloAdmin, duenoOAdmin
conexion.js     Conexión a MySQL
index.js        Servidor Express
docs/           Documentación generada por apidoc
```

## Roles y permisos

| Rol | Puede |
|---|---|
| Sin sesión | Ver planes y ubicaciones, registrarse e iniciar sesión |
| `cliente` | Crear servidores y ver, encender, apagar y eliminar **sus** servidores |
| `admin` | Todo lo anterior + crear, editar y eliminar planes, ver todos los servidores y gestionar usuarios |

Los permisos se controlan con tres middlewares:
- `verificarToken`: revisa el token JWT del header `Authorization: Bearer <token>`.
- `soloAdmin`: deja pasar solo a usuarios con rol `admin`.
- `duenoOAdmin`: deja pasar al dueño del servidor o a un admin.

## Endpoints (17)

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| POST | `/api/login` | Público | Iniciar sesión (usuario o email) |
| POST | `/api/registro` | Público | Crear una cuenta |
| GET | `/api/planes` | Público | Listar planes |
| GET | `/api/planes/:id` | Público | Obtener un plan |
| POST | `/api/planes` | Admin | Crear un plan |
| PUT | `/api/planes/:id` | Admin | Editar un plan |
| DELETE | `/api/planes/:id` | Admin | Eliminar un plan |
| GET | `/api/servidores` | Admin | Listar todos los servidores |
| GET | `/api/servidores/mios` | Con sesión | Listar mis servidores |
| GET | `/api/servidores/:id` | Dueño o admin | Obtener un servidor |
| POST | `/api/servidores` | Con sesión | Crear un servidor (con plan o personalizado) |
| PUT | `/api/servidores/:id` | Dueño o admin | Encender o apagar un servidor |
| DELETE | `/api/servidores/:id` | Dueño o admin | Eliminar un servidor |
| GET | `/api/usuarios` | Admin | Listar usuarios |
| PUT | `/api/usuarios/:id` | Admin | Cambiar el rol de un usuario |
| DELETE | `/api/usuarios/:id` | Admin | Eliminar un usuario |
| GET | `/api/ubicaciones` | Público | Listar ubicaciones |

## Base de datos

Tablas principales: `usuarios`, `planes` y `servidores`. Tabla auxiliar de solo lectura: `ubicaciones`.

Para convertir una cuenta en admin:
```sql
UPDATE usuarios SET rol = 'admin' WHERE username = 'nombre_de_usuario';
```

## Repositorio del frontend

[tpi-frontend](https://github.com/fantoniMatias/tpi-frontend)

-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 20-11-2026 a las 23:44:53
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `tpi_hosting`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `logs_servidor`
--

CREATE TABLE `logs_servidor` (
  `id_log` int(11) NOT NULL,
  `id_servidor` int(11) NOT NULL,
  `mensaje` text NOT NULL,
  `fecha` timestamp NOT NULL DEFAULT current_timestamp(),
  `tipo` enum('info','advertencia','error') NOT NULL DEFAULT 'info'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pagos`
--

CREATE TABLE `pagos` (
  `id_pago` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `monto` decimal(10,2) NOT NULL,
  `metodo_pago` varchar(50) DEFAULT NULL,
  `estado` enum('pendiente','aprobado','rechazado') NOT NULL DEFAULT 'pendiente',
  `fecha_pago` timestamp NOT NULL DEFAULT current_timestamp(),
  `id_servidor` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `planes`
--

CREATE TABLE `planes` (
  `id_plan` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `ram_gb` int(11) NOT NULL,
  `cpu_cores` int(11) NOT NULL,
  `almacenamiento_gb` int(11) NOT NULL,
  `precio` decimal(10,2) NOT NULL,
  `activo` tinyint(1) DEFAULT 1,
  `max_jugadores` int(11) NOT NULL DEFAULT 10,
  `descripcion` varchar(255) DEFAULT NULL,
  `recomendacion` varchar(500) DEFAULT NULL,
  `imagen` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `planes`
--

INSERT INTO `planes` (`id_plan`, `nombre`, `ram_gb`, `cpu_cores`, `almacenamiento_gb`, `precio`, `activo`, `max_jugadores`, `descripcion`, `recomendacion`, `imagen`) VALUES
(1, 'Slime', 2, 1, 10, 3000.00, 1, 5, 'El plan inicial para probar NexusHost.', 'Perfecto para disfrutar de una experiencia vanilla con un par de amigos. No se recomienda usar mods, plugins pesados ni explorar mucho terreno nuevo al mismo tiempo.', '/mobs/1.png'),
(2, 'Araña', 3, 1, 15, 4500.00, 1, 8, 'Vanilla para un grupo chico.', 'Ideal para un mundo vanilla con un grupo chico. Podés sumar algún plugin liviano, pero no se recomiendan los mods pesados ni la generación intensiva de terreno.', '/mobs/2.png'),
(3, 'Zombie', 4, 2, 20, 6000.00, 1, 12, 'Ideal para jugar con amigos sin complicarse.', 'Una buena opción para jugar con amigos sin complicarse. Funciona bien con vanilla o Paper y algunos plugins. No se recomiendan modpacks grandes.', '/mobs/3.png'),
(4, 'Esqueleto', 6, 2, 30, 9000.00, 1, 20, 'Vanilla con algunos plugins.', 'Pensado para un servidor vanilla más activo o con varios plugins de administración. Admite mods livianos si no hay muchos jugadores conectados.', '/mobs/4.png'),
(5, 'Creeper', 8, 3, 40, 12000.00, 1, 30, 'El equilibrio justo para una comunidad chica.', 'El equilibrio justo para una comunidad chica. Soporta varios plugins y modpacks livianos. Conviene pregenerar el mapa para evitar lag al explorar.', '/mobs/5.png'),
(6, 'Blaze', 10, 4, 60, 15000.00, 1, 40, 'Para modpacks livianos.', 'Recomendado para modpacks livianos y medianos. Tiene margen para varios jugadores explorando a la vez, aunque los modpacks más pesados pueden quedarle justos.', '/mobs/6.png'),
(7, 'Enderman', 12, 4, 80, 18000.00, 1, 60, 'Modpacks medianos y más jugadores.', 'Una opción cómoda para modpacks medianos y comunidades activas. Permite sumar mods de generación de terreno con buen rendimiento.', '/mobs/7.png'),
(8, 'Warden', 16, 6, 100, 24000.00, 1, 80, 'Para comunidades grandes y modpacks pesados.', 'Preparado para modpacks pesados y comunidades grandes. Es una buena elección si tu servidor tiene muchos jugadores conectados todos los días.', '/mobs/8.png'),
(9, 'Herobrine', 24, 8, 150, 36000.00, 1, 120, 'El plan más potente de NexusHost.', 'Máxima potencia para los proyectos más exigentes: modpacks muy pesados, muchos jugadores y mundos enormes. Si recién empezás, un plan menor te va a alcanzar.', '/mobs/9.png');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `servidores`
--

CREATE TABLE `servidores` (
  `id_servidor` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `id_plan` int(11) DEFAULT NULL,
  `nombre_servidor` varchar(100) NOT NULL,
  `ip` varchar(45) DEFAULT NULL,
  `estado` enum('encendido','apagado','suspendido') NOT NULL DEFAULT 'apagado',
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `edicion` enum('java','bedrock') NOT NULL DEFAULT 'java',
  `tipo_software` enum('vanilla','paper','forge','fabric') NOT NULL DEFAULT 'vanilla',
  `version` varchar(20) NOT NULL DEFAULT '1.20.4',
  `puerto` int(11) NOT NULL DEFAULT 25565,
  `id_ubicacion` int(11) DEFAULT NULL,
  `ram_gb` int(11) DEFAULT NULL,
  `almacenamiento_gb` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tickets_soporte`
--

CREATE TABLE `tickets_soporte` (
  `id_ticket` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `asunto` varchar(150) NOT NULL,
  `mensaje` text NOT NULL,
  `estado` enum('abierto','en_proceso','cerrado') NOT NULL DEFAULT 'abierto',
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `prioridad` enum('baja','media','alta') NOT NULL DEFAULT 'media',
  `respuesta` text DEFAULT NULL,
  `fecha_respuesta` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ubicaciones`
--

CREATE TABLE `ubicaciones` (
  `id_ubicacion` int(11) NOT NULL,
  `ciudad` varchar(50) NOT NULL,
  `pais` varchar(50) NOT NULL,
  `codigo_pais` char(2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `ubicaciones`
--

INSERT INTO `ubicaciones` (`id_ubicacion`, `ciudad`, `pais`, `codigo_pais`) VALUES
(1, 'Buenos Aires', 'Argentina', 'ar'),
(2, 'São Paulo', 'Brasil', 'br'),
(3, 'Miami', 'Estados Unidos', 'us'),
(4, 'Frankfurt', 'Alemania', 'de');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id_usuario` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `rol` enum('cliente','admin') NOT NULL DEFAULT 'cliente',
  `activo` tinyint(1) DEFAULT 1,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id_usuario`, `username`, `email`, `password`, `rol`, `activo`, `fecha_creacion`) VALUES
(10, 'prueba', 'prueba@nexushost.gg', '$2b$10$JAj5KY2hbkTJkXFtDEDZOO9buAYLIgheiSMObRD9OvCJXRbVHwPly', 'cliente', 1, '2026-11-20 20:24:24'),
(11, 'adminprueba', 'adminprueba@nexushost.gg', '$2b$10$zbyVfDiSfSCzcHqw5jYQ1ucs9TCzgNe24qi3Pp3Mcfk9W8jZfMWcy', 'admin', 1, '2026-11-20 21:55:40');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `logs_servidor`
--
ALTER TABLE `logs_servidor`
  ADD PRIMARY KEY (`id_log`),
  ADD KEY `id_servidor` (`id_servidor`);

--
-- Indices de la tabla `pagos`
--
ALTER TABLE `pagos`
  ADD PRIMARY KEY (`id_pago`),
  ADD KEY `id_usuario` (`id_usuario`),
  ADD KEY `pagos_ibfk_2` (`id_servidor`);

--
-- Indices de la tabla `planes`
--
ALTER TABLE `planes`
  ADD PRIMARY KEY (`id_plan`);

--
-- Indices de la tabla `servidores`
--
ALTER TABLE `servidores`
  ADD PRIMARY KEY (`id_servidor`),
  ADD KEY `id_usuario` (`id_usuario`),
  ADD KEY `id_plan` (`id_plan`),
  ADD KEY `servidores_ibfk_3` (`id_ubicacion`);

--
-- Indices de la tabla `tickets_soporte`
--
ALTER TABLE `tickets_soporte`
  ADD PRIMARY KEY (`id_ticket`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indices de la tabla `ubicaciones`
--
ALTER TABLE `ubicaciones`
  ADD PRIMARY KEY (`id_ubicacion`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id_usuario`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `logs_servidor`
--
ALTER TABLE `logs_servidor`
  MODIFY `id_log` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT de la tabla `pagos`
--
ALTER TABLE `pagos`
  MODIFY `id_pago` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `planes`
--
ALTER TABLE `planes`
  MODIFY `id_plan` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de la tabla `servidores`
--
ALTER TABLE `servidores`
  MODIFY `id_servidor` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `tickets_soporte`
--
ALTER TABLE `tickets_soporte`
  MODIFY `id_ticket` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `ubicaciones`
--
ALTER TABLE `ubicaciones`
  MODIFY `id_ubicacion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `logs_servidor`
--
ALTER TABLE `logs_servidor`
  ADD CONSTRAINT `logs_servidor_ibfk_1` FOREIGN KEY (`id_servidor`) REFERENCES `servidores` (`id_servidor`) ON DELETE CASCADE;

--
-- Filtros para la tabla `pagos`
--
ALTER TABLE `pagos`
  ADD CONSTRAINT `pagos_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE,
  ADD CONSTRAINT `pagos_ibfk_2` FOREIGN KEY (`id_servidor`) REFERENCES `servidores` (`id_servidor`) ON DELETE SET NULL;

--
-- Filtros para la tabla `servidores`
--
ALTER TABLE `servidores`
  ADD CONSTRAINT `servidores_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE,
  ADD CONSTRAINT `servidores_ibfk_2` FOREIGN KEY (`id_plan`) REFERENCES `planes` (`id_plan`),
  ADD CONSTRAINT `servidores_ibfk_3` FOREIGN KEY (`id_ubicacion`) REFERENCES `ubicaciones` (`id_ubicacion`);

--
-- Filtros para la tabla `tickets_soporte`
--
ALTER TABLE `tickets_soporte`
  ADD CONSTRAINT `tickets_soporte_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

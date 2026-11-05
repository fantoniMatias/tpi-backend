-- Ejecutar DESPUÉS de planes-mobs.sql.
-- Cambia Endermite por Slime y Silverfish por Araña,
-- y agrega la recomendación que se ve en la ventana de cada plan.

ALTER TABLE planes ADD COLUMN recomendacion VARCHAR(500) NULL;

UPDATE planes SET nombre = 'Slime', descripcion = 'El plan inicial para probar NexusHost.',
  recomendacion = 'Perfecto para disfrutar de una experiencia vanilla con un par de amigos. No se recomienda usar mods, plugins pesados ni explorar mucho terreno nuevo al mismo tiempo.'
  WHERE id_plan = 1;

UPDATE planes SET nombre = 'Araña', descripcion = 'Vanilla para un grupo chico.',
  recomendacion = 'Ideal para un mundo vanilla con un grupo chico. Podés sumar algún plugin liviano, pero no se recomiendan los mods pesados ni la generación intensiva de terreno.'
  WHERE id_plan = 2;

UPDATE planes SET
  recomendacion = 'Una buena opción para jugar con amigos sin complicarse. Funciona bien con vanilla o Paper y algunos plugins. No se recomiendan modpacks grandes.'
  WHERE id_plan = 3;

UPDATE planes SET
  recomendacion = 'Pensado para un servidor vanilla más activo o con varios plugins de administración. Admite mods livianos si no hay muchos jugadores conectados.'
  WHERE id_plan = 4;

UPDATE planes SET
  recomendacion = 'El equilibrio justo para una comunidad chica. Soporta varios plugins y modpacks livianos. Conviene pregenerar el mapa para evitar lag al explorar.'
  WHERE id_plan = 5;

UPDATE planes SET
  recomendacion = 'Recomendado para modpacks livianos y medianos. Tiene margen para varios jugadores explorando a la vez, aunque los modpacks más pesados pueden quedarle justos.'
  WHERE id_plan = 6;

UPDATE planes SET
  recomendacion = 'Una opción cómoda para modpacks medianos y comunidades activas. Permite sumar mods de generación de terreno con buen rendimiento.'
  WHERE id_plan = 7;

UPDATE planes SET
  recomendacion = 'Preparado para modpacks pesados y comunidades grandes. Es una buena elección si tu servidor tiene muchos jugadores conectados todos los días.'
  WHERE id_plan = 8;

UPDATE planes SET
  recomendacion = 'Máxima potencia para los proyectos más exigentes: modpacks muy pesados, muchos jugadores y mundos enormes. Si recién empezás, un plan menor te va a alcanzar.'
  WHERE id_plan = 9;

-- Planes de NexusHost con nombres de mobs hostiles, del más débil al más fuerte.
-- Convierte los 3 planes originales y agrega 6 nuevos.
-- Precios en pesos, a $1500 por GB de RAM. Son datos simulados.

UPDATE planes SET nombre = 'Endermite', ram_gb = 2, cpu_cores = 1, almacenamiento_gb = 10, precio = 3000, max_jugadores = 5,
  descripcion = 'El más chico. Para probar o jugar con un par de amigos.' WHERE id_plan = 1;

UPDATE planes SET nombre = 'Silverfish', ram_gb = 3, cpu_cores = 1, almacenamiento_gb = 15, precio = 4500, max_jugadores = 8,
  descripcion = 'Un mundo vanilla para un grupo chico.' WHERE id_plan = 2;

UPDATE planes SET nombre = 'Zombie', ram_gb = 4, cpu_cores = 2, almacenamiento_gb = 20, precio = 6000, max_jugadores = 12,
  descripcion = 'Ideal para jugar con amigos sin complicarse.' WHERE id_plan = 3;

INSERT INTO planes (nombre, ram_gb, cpu_cores, almacenamiento_gb, precio, max_jugadores, descripcion) VALUES
  ('Esqueleto', 6, 2, 30, 9000, 20, 'Vanilla con algunos plugins.'),
  ('Creeper', 8, 3, 40, 12000, 30, 'El equilibrio justo para una comunidad chica.'),
  ('Blaze', 10, 4, 60, 15000, 40, 'Para modpacks livianos.'),
  ('Enderman', 12, 4, 80, 18000, 60, 'Modpacks medianos y más jugadores.'),
  ('Warden', 16, 6, 100, 24000, 80, 'Para comunidades grandes y modpacks pesados.'),
  ('Herobrine', 24, 8, 150, 36000, 120, 'El plan más potente de NexusHost.');

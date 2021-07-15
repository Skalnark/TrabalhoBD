SELECT c.*, p.username FROM comment c
  JOIN passenger p ON p.id_passenger = c.id_passenger
WHERE c.id_bus = $1;
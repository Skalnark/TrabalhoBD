select * from bus b
  where b.id_bus IN (select id_bus from station_bus sb where sb.id_station = $1);
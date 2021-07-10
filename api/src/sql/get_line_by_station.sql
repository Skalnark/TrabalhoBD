select * from line l 
  where l.code IN (select line_code from station_line sl where sl.id_station = $1);
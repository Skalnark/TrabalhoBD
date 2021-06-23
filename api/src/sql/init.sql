DROP TABLE IF EXISTS passenger, post, comment, bus, line_bus, line, station, station_line;

CREATE TABLE passenger(
  id_passenger SERIAL UNIQUE PRIMARY KEY,
  nome VARCHAR(60),
  email VARCHAR(60),
  password VARCHAR(60),
  role_type VARCHAR(10),
  scholarity VARCHAR(24) NOT NULL
);

CREATE TABLE line (
    code INT PRIMARY KEY
);

CREATE TABLE bus(
    id_bus SERIAL UNIQUE PRIMARY KEY,
    line_code INT REFERENCES line (code),
    departure_time TIME NOT NULL,
    passenger_count INT NOT NULL
);

CREATE TABLE post(
    id_post SERIAL UNIQUE PRIMARY KEY,
    id_bus INT NOT NULL REFERENCES bus (id_bus)
);

CREATE TABLE comment(
    id_comment SERIAL UNIQUE PRIMARY KEY,
    id_post INT NOT NULL REFERENCES post (id_post) ON DELETE CASCADE,
    id_passenger INT NOT NULL REFERENCES passenger (id_passenger),
    created_at DATE NOT NULL,
    content VARCHAR(200)
);

CREATE TABLE station (
    id_station SERIAL UNIQUE PRIMARY KEY,
    street VARCHAR(31),
    district VARCHAR(31),
    reference VARCHAR(31)
);

CREATE TABLE station_bus (
    id_station_bus SERIAL UNIQUE PRIMARY KEY,
    id_bus INT NOT NULL REFERENCES bus (id_bus) ON DELETE CASCADE,
    id_station INT NOT NULL REFERENCES station (id_station) ON DELETE CASCADE,
    last_seen TIME NOT NULL
);

CREATE TABLE station_line (
    id_station_line SERIAL UNIQUE PRIMARY KEY,
    id_station INT NOT NULL REFERENCES station (id_station) ON DELETE CASCADE,
    line_code INT NOT NULL REFERENCES line (code) ON DELETE CASCADE
);

INSERT INTO line(code) VALUES (2303);
INSERT INTO line(code) VALUES (2307);
INSERT INTO line(code) VALUES (3203);
INSERT INTO line(code) VALUES (3207);
INSERT INTO bus(line_code, departure_time, passenger_count) VALUES (2303, '7:23:00', 60);
INSERT INTO bus(line_code, departure_time, passenger_count) VALUES (2307, '8:28:00', 60);
INSERT INTO bus(line_code, departure_time, passenger_count) VALUES (3203, '12:20:00', 32);
INSERT INTO bus(line_code, departure_time, passenger_count) VALUES (3207, '00:32:00', 30);
INSERT INTO station(street, district, reference) VALUES ('Rua tal', 'Bairro tal', 'Em frente a tal lugar');
INSERT INTO station_bus(id_bus, id_station, last_seen) VALUES (1, 1, '14:30:00');
INSERT INTO station_bus(id_bus, id_station, last_seen) VALUES (2, 1, '9:20:00');
INSERT INTO station_bus(id_bus, id_station, last_seen) VALUES (3, 1, '16:10:00');
INSERT INTO station_bus(id_bus, id_station, last_seen) VALUES (4, 1, '23:50:00');
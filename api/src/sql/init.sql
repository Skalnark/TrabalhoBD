DROP TABLE IF EXISTS passenger, post, comment, bus, line_bus, line, station, station_line;

CREATE TABLE passenger(
  id_passenger SERIAL UNIQUE PRIMARY KEY,
  nome VARCHAR(60),
  email VARCHAR(60),
  password VARCHAR(60),
  role_type VARCHAR(10),
  scholarity VARCHAR(24) NOT NULL
);


CREATE TABLE bus(
    id_bus SERIAL UNIQUE PRIMARY KEY,
    line_number VARCHAR(10),
    departure_time DATE,
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
    created_at DATE,
    content VARCHAR(200)
);

CREATE TABLE line (
    id_line SERIAL UNIQUE PRIMARY KEY,
    code VARCHAR(20)
);

CREATE TABLE line_bus (
    id_line_bus SERIAL UNIQUE PRIMARY KEY,
    id_bus INT NOT NULL REFERENCES bus (id_bus) ON DELETE CASCADE,
    id_line INT NOT NULL REFERENCES line (id_line) ON DELETE CASCADE,
    schedule DATE
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
    last_seen DATE
);

CREATE TABLE station_line (
    id_station_line SERIAL UNIQUE PRIMARY KEY,
    id_station INT NOT NULL REFERENCES station (id_station) ON DELETE CASCADE,
    id_line INT NOT NULL REFERENCES line (id_line) ON DELETE CASCADE
);

INSERT INTO bus(line_number, departure_time, passenger_count) VALUES (0, '2021-01-01 12:00', 60);
INSERT INTO line(code) VALUES ('1500');
INSERT INTO line_bus(id_bus, id_line, schedule) VALUES(1, 1, '2021-01-01 12:30');
INSERT INTO station(street, district, reference) VALUES ('Rua tal', 'Bairro tal', 'Em frente a tal lugar');
INSERT INTO station_bus(id_bus, id_station, last_seen) VALUES (1, 1, '2021-01-01 14:00');
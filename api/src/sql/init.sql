DROP TABLE IF EXISTS passenger, post, comment, bus, line_bus, line, bus_stop, bus_stop_line;

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
    passengers INT
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

CREATE TABLE bus_stop (
    id_bus_stop SERIAL UNIQUE PRIMARY KEY,
    street VARCHAR(31),
    district VARCHAR(31),
    reference VARCHAR(31)
);

CREATE TABLE bus_stop_line (
    id_bus_stop_line SERIAL UNIQUE PRIMARY KEY,
    id_bus_stop INT NOT NULL REFERENCES bus_stop (id_bus_stop) ON DELETE CASCADE,
    id_line INT NOT NULL REFERENCES line (id_line) ON DELETE CASCADE
);

INSERT INTO bus(line_number, departure_time, passengers) VALUES (0, '2021-01-01 12:00', 60);
INSERT INTO line(code) VALUES ('1500');
INSERT INTO line_bus(id_bus, id_line, schedule) VALUES(1, 1, '2021-01-01 12:30');
INSERT INTO bus_stop(street, district, reference) VALUES ('Rua tal', 'Bairro tal', 'Em frente a tal lugar');
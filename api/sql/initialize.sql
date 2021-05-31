DROP TABLE IF EXISTS usuario;

CREATE TABLE usuario(
  id SERIAL UNIQUE PRIMARY KEY,
  nome VARCHAR(60),
  email VARCHAR(60),
  senha VARCHAR(60),
  tipo_de_conta VARCHAR(10),
  escolaridade VARCHAR(24) NOT NULL,
  created_at timestamp NOT NULL DEFAULT NOW()
);
DROP TABLE IF EXISTS usuario, post, mensagem, onibus, linha_onibus, linha, ponto, ponto_linha;

CREATE TABLE usuario(
  id_usuario SERIAL UNIQUE PRIMARY KEY,
  nome VARCHAR(60),
  email VARCHAR(60),
  senha VARCHAR(60),
  tipo_de_conta VARCHAR(10),
  escolaridade VARCHAR(24) NOT NULL
);


CREATE TABLE onibus(
    id_onibus SERIAL UNIQUE PRIMARY KEY,
    numero_da_linha VARCHAR(10),
    horario_de_partida DATE,
    passageiros VARCHAR(1)
);

CREATE TABLE post(
    id_post SERIAL UNIQUE PRIMARY KEY,
    id_usuario INT NOT NULL REFERENCES usuario (id_usuario),
    id_onibus INT NOT NULL REFERENCES onibus (id_onibus)
);

CREATE TABLE mensagem(
    id_mensagem SERIAL UNIQUE PRIMARY KEY,
    id_post INT NOT NULL REFERENCES post (id_post) ON DELETE CASCADE,
    data DATE,
    texto VARCHAR(200)
);

CREATE TABLE linha (
    id_linha SERIAL UNIQUE PRIMARY KEY,
    codigo VARCHAR(20)
);

CREATE TABLE linha_onibus (
    id_linha_onibus SERIAL UNIQUE PRIMARY KEY,
    id_onibus INT NOT NULL REFERENCES onibus (id_onibus) ON DELETE CASCADE,
    id_linha INT NOT NULL REFERENCES linha (id_linha) ON DELETE CASCADE
);

CREATE TABLE ponto (
    id_ponto SERIAL UNIQUE PRIMARY KEY,
    rua VARCHAR(31),
    bairro VARCHAR(31),
    referencia VARCHAR(31)
);

CREATE TABLE ponto_linha (
    id_ponto_linha SERIAL UNIQUE PRIMARY KEY,
    id_ponto INT NOT NULL REFERENCES ponto (id_ponto) ON DELETE CASCADE,
    id_linha INT NOT NULL REFERENCES linha (id_linha) ON DELETE CASCADE
);
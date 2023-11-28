CREATE DATABASE agendify;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users(
  id UUID NOT NULL UNIQUE DEFAULT uuid_generate_v4(),
  name VARCHAR NOT NULL,
  email VARCHAR NOT NULL UNIQUE,
  password VARCHAR NOT NULL,
  phone VARCHAR,
  type_user VARCHAR NOT NULL -- 'C'liente / 'P'rofissional
);

CREATE TABLE IF NOT EXISTS professionals(
  id UUID NOT NULL UNIQUE DEFAULT uuid_generate_v4(),
  description VARCHAR,
  photo VARCHAR,
  activity VARCHAR,
  location VARCHAR,
  type_service VARCHAR NOT NULL, -- 'T'empo / 'P'ersonalizado
  user_id UUID,
  FOREIGN KEY(user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS services(
  id UUID NOT NULL UNIQUE DEFAULT uuid_generate_v4(),
  name VARCHAR NOT NULL,
  description VARCHAR,
  price NUMERIC(10,2),
  duration VARCHAR,
  availability VARCHAR,
  special_requirements VARCHAR,
  optional VARCHAR,
  photo1 VARCHAR,
  photo2 VARCHAR,
  photo3 VARCHAR,
  professional_id UUID,
  FOREIGN KEY(professional_id) REFERENCES professionals(id)
);

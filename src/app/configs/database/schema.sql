CREATE DATABASE agendify;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users(
  id UUID NOT NULL UNIQUE DEFAULT uuid_generate_v4(),
  name VARCHAR NOT NULL,
  email VARCHAR NOT NULL UNIQUE,
  photo VARCHAR,
  password VARCHAR NOT NULL,
  phone VARCHAR,
  status VARCHAR,
  type_user VARCHAR NOT NULL -- 'C'liente / 'P'rofissional
);

CREATE TABLE IF NOT EXISTS professionals(
  id UUID NOT NULL UNIQUE DEFAULT uuid_generate_v4(),
  description VARCHAR,
  banner VARCHAR,
  activity VARCHAR,
  location VARCHAR,
  scheduleAvailability NUMERIC(100),
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
  photos VARCHAR,
  user_id UUID,
  FOREIGN KEY(user_id) REFERENCES users(id)
);

CREATE TYPE weekDays AS ENUM ('domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado');

CREATE TABLE IF NOT EXISTS schedule(
  id UUID NOT NULL UNIQUE DEFAULT uuid_generate_v4(),
  userIdProfessional UUID,
  weekDay weekDays NOT NULL,
  startTime TIME NOT NULL,
  endTime TIME NOT NULL,
  FOREIGN KEY(userIdProfessional) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS events(
  id UUID NOT NULL UNIQUE DEFAULT uuid_generate_v4(),
  userIdProfessional UUID NOT NULL,
  userIdClient UUID NOT NULL,
  serviceId UUID NOT NULL,
  dateEvent DATE NOT NULL,
  startTime TIME NOT NULL,
  endTime TIME NOT NULL,
  status VARCHAR,
  created TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'America/Sao_Paulo'),
  updated TIMESTAMP,
  observation VARCHAR,
  color VARCHAR,
  FOREIGN KEY(serviceId) REFERENCES services(id),
  FOREIGN KEY(userIdProfessional) REFERENCES users(id),
  FOREIGN KEY(userIdClient) REFERENCES users(id)
);

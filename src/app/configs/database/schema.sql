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
  availability VARCHAR,
  special_requirements VARCHAR,
  optional VARCHAR,
  photos VARCHAR,
  user_id UUID,
  FOREIGN KEY(user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS professional_weekdays_times(
  id UUID NOT NULL UNIQUE DEFAULT uuid_generate_v4(),
  userIdProfessional UUID NOT NULL,
  weekDay VARCHAR NOT NULL,
  indice numeric(1),
  work BOOLEAN DEFAULT true,
  startTimes VARCHAR[] NOT NULL,
  FOREIGN KEY(userIdProfessional) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS events(
  id UUID NOT NULL UNIQUE DEFAULT uuid_generate_v4(),
  userIdProfessional UUID NOT NULL,
  userIdClient UUID,
  clientName VARCHAR,
  clientPhone VARCHAR,
  clientEmail VARCHAR,
  serviceId UUID,
  serviceDescription VARCHAR,
  servicePrice NUMERIC(10,2),
  eventDescription VARCHAR,
  dateEvent DATE NOT NULL,
  startTime VARCHAR NOT NULL,
  status VARCHAR,
  created TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'America/Sao_Paulo'),
  updated TIMESTAMP,
  observation VARCHAR,
  color VARCHAR,
  quality INTEGER DEFAULT 0,
  FOREIGN KEY(userIdProfessional) REFERENCES users(id)
);

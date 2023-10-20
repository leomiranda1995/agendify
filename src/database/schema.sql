CREATE DATABASE agendaai;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS professionals(
  id UUID NOT NULL UNIQUE DEFAULT uuid_generate_v4(),
  name VARCHAR NOT NULL,
  email VARCHAR NOT NULL UNIQUE,
  password VARCHAR NOT NULL,
  activity VARCHAR,
  description VARCHAR,
  location VARCHAR,
  phone VARCHAR,
  base_price NUMERIC(10,2),
  payment_methods VARCHAR
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
  professional_id UUID,
  FOREIGN KEY(professional_id) REFERENCES professionals(id)
);

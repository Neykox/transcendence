#!/bin/bash
set -e

psql -U "$POSTGRES_USER" "$POSTGRES_DB" <<EOF

CREATE TABLE "user" (
  id SERIAL PRIMARY KEY,
  pseudo VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  status VARCHAR(255) DEFAULT '',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TYPE channel_type_enum AS ENUM ('public', 'private', 'protected');

CREATE TABLE channel (
  id SERIAL PRIMARY KEY,
  owner INTEGER NOT NULL,
  name VARCHAR(255) NOT NULL UNIQUE,
  type channel_type_enum NOT NULL,
  password VARCHAR(255)
);

# CREATE TABLE chan_user (
#   id SERIAL PRIMARY KEY,
#   "user" INTEGER NOT NULL,
#   channel INTEGER NOT NULL
# );

# CREATE TABLE message (
#   id SERIAL PRIMARY KEY,
#   creator INTEGER NOT NULL,
#   channel INTEGER NOT NULL,
#   content TEXT
# );

# CREATE TABLE chan_admins (
#   id SERIAL PRIMARY KEY,
#   channel INTEGER NOT NULL,
#   "user" INTEGER NOT NULL
# );

# CREATE TABLE muted_user (
#   id SERIAL PRIMARY KEY,
#   channel INTEGER NOT NULL,
#   "user" INTEGER NOT NULL,
#   until DATE
# );

# CREATE TABLE ban_user (
#   id SERIAL PRIMARY KEY,
#   channel INTEGER NOT NULL,
#   "user" INTEGER NOT NULL
# );
EOF

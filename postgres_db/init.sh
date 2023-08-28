#!/bin/bash
set -e

psql -U "$POSTGRES_USER" "$POSTGRES_DB" <<EOF

CREATE TYPE channel_type_enum AS ENUM ('public', 'private', 'protected');

CREATE TABLE channel (
  id SERIAL PRIMARY KEY,
  owner INTEGER NOT NULL,
  name VARCHAR(255) NOT NULL UNIQUE,
  type channel_type_enum NOT NULL,
  password VARCHAR(255)
);

CREATE TABLE "user" (
    id SERIAL PRIMARY KEY,
    pseudo VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
	friend_list TEXT DEFAULT '',
    status VARCHAR(255) DEFAULT '',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

# CREATE TABLE "friend_requests" (
#     id SERIAL PRIMARY KEY,
#     sender VARCHAR(255) NOT NULL,
#     receiver VARCHAR(255) NOT NULL
# );
EOF

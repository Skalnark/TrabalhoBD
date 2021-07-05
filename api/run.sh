#!/bin/sh
docker-compose up --build ; docker-compose down && docker volume rm api_dbapi
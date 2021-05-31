#!/bin/sh

docker-compose up ; docker-compose down && docker volume rm api_dbapi


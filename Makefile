all : up

up :
	docker-compose up --build

down :
	docker-compose down -v

prune: down
	docker system prune -a -f

re : down all

.PHONY: all up down clean prune re

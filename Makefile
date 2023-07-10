all : build

up :
	docker-compose up

build :
	docker-compose up --build

down :
	docker-compose down -v 

prune: down
#ajouter les commandes

re : #clean
#	docker-compose -f ./srcs/docker-compose.yml up --build

.PHONY: all up down clean prune re
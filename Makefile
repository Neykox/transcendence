all : up

up :
	docker compose up --build

down :
	docker compose down --volumes

clean: down
	sudo rm -rf /home/aleroy/data/mariadb/*
	sudo rm -rf /home/aleroy/data/wordpress/*

prune: down
	docker system prune -fa

stop:
	sudo service nginx stop
	sudo service mysql stop

fclean: clean prune

re : clean
	docker-compose -f ./srcs/docker-compose.yml up --build

.PHONY: all up down clean prune stop re
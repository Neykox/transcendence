all : up

up :
	docker-compose -f ./srcs/docker-compose.yml up

down :
	docker-compose -f ./srcs/docker-compose.yml down

clean: down
	-docker volume rm $$(sudo docker volume ls -q)
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
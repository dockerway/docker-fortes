## Build Image
* Reemplazar tagname por la version de la imagen (misma version que git)
`docker build -t sndregistry.sondeosglobal.com/dockerway/docker-fortes:tagname .`

## PUSH Image

`docker push sndregistry.sondeosglobal.com/dockerway/docker-fortes`

## Docker deploy development with run

`docker run -it --network="host" -p 8888:5000 sndregistry.sondeosglobal.com/dockerway/docker-fortes`

## Docker deploy with compose

`docker-compose up -d`

## Stack deploy
`docker stack deploy -c docker-compose.yml stackName`

## Build Image
* Reemplazar tagname por la version de la imagen (misma version que git)
`docker build -t cincarnato/docker-fortes:tagname .`

## PUSH Image

`docker push cincarnato/docker-fortes`

## Docker deploy development with run

`docker run -it --network="host" -p 8888:5000 cincarnato/docker-fortes`

## Docker deploy with compose

`docker-compose up -d`

## Stack deploy
`docker stack deploy -c docker-compose.yml stackName`

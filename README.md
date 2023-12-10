<p align="center">
  <a href="https://www.catalisa.io/" target="blank"><img src="https://static.wixstatic.com/media/18218e_bb86cda9c93a447395a183ce7ed10290~mv2.png/v1/fill/w_319,h_77,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/logo_catalisa_baixa.png" width="200" alt="Nest Logo" /></a>
</p>

<h1 align="center">Desafio vaga desenvolvedor back-end</h1>

## Installation

```bash
$ npm install
```
## docker

```bash
#run docker
$ docker-compose up
```

## pgAdmin dev

```bash

#os dados e senhas estão no código, no docker-compose, 
# entra com a senha e login, 
# login: banco_catalisa@pgadmin.org
# senha: bancoCatalisa
# cria um novo banco de dados,
# new database,
# general -> name: postgres,
# connection -> hostname/adress (ifconfig e pega o ip na maquina), password: root, 
# save

$ http://localhost:54322/browser/

```

## Running the app

```bash
$ npm run start:dev
```

## migration

```bash
#depois que conectar fazer a migração das tabelas

$ npm run typeorm migration:run

```
## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Description routes
  #User: 
  - create entity, controller, service and module.
  - service : 
    * Create, route: http://localhost:3000/users/create
    * Update, route: http://localhost:3000/users/update/{id}
    * Deactivate, route: http://localhost:3000/users/deactivate/{id}

## Stay in touch

- Author - [Patricia Oliveira](https://www.linkedin.com/in/patricia-silva-oliveira-/)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)


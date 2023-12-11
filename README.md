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

  #exemplo para criar uma migration
$ npm run migration:generate -- db/migrations/NewMigration

# para rodar
$ npm run migration:run

#para reverter
$ npm run migration:revert
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
## Swagger
  http://localhost:3000/api#/

## Description routes
  #User: 
  - create entity, controller, service, test service, test controller, and module.
  - service and controller : 
    * Create
    * Update
    * Deactivate

  #Account:
  - create entity, controller, test service, test controller, service and module
  - service and controller : 
    * Create
    * FindAll
    * Deactivated
    * Deposit
    * Withdraw
    * findByUserId
    * findOne
    * findByDeposit
    * findByWithdraw

## Stay in touch

- Author - [Patricia Oliveira](https://www.linkedin.com/in/patricia-silva-oliveira-/)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)


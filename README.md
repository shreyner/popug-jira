## Description

Popug jira.

## Installation

```bash
$ npm install
```

### Что было сделано по инфраструктуре

- Добавлены скрипты для создания схемы и обновления схем. С учетом монорепозитория NestJS'а

### Полезные ссылки

Как выбрать target в зависимости от NodeJS https://github.com/microsoft/TypeScript/wiki/Node-Target-Mapping

Ссылки по инфраструктуре

- 10 best practices to containerize Node.js web applications with
  Docker [snyk.io/blog/10-best-practices-to-containerize-nodejs-web-applications-with-docker](https://snyk.io/blog/10-best-practices-to-containerize-nodejs-web-applications-with-docker/)
- Добавить в Docker image [github.com/Yelp/dumb-init](https://github.com/Yelp/dumb-init)
- Статья с описанием структуры для NestJS
  приложения [medium.com/the-crowdlinker-chronicle/best-way-to-structure-your-directory-code-nestjs](https://medium.com/the-crowdlinker-chronicle/best-way-to-structure-your-directory-code-nestjs-a06c7a641401)
- [Naming Cheatsheet](https://github.com/kettanaito/naming-cheatsheet#naming-functions)
- [REST API Tutorial — руководство по REST API](https://restapitutorial.ru)

### TODO:

- [class-transformer](https://github.com/typestack/class-transformer) использовать для DTO на reponse

- Update NestJS
- Update TS
- Добавить глобальный async
- Добавить распределенный лок или saga для лока операций над Task
- Добавить версионирование для api
- Настроить swagger для auth
- Покрыть e2e тестами auth

Сервис Auth

- Добавить скрипт для добавления новых пользователей через вызов скрипта. Для первого запуска и добавление новых пользователей не через web морду.

Для единой авторизации через api-gateway:
Должно происходить на api-gateway. Далее он авторизует пользователя и подкладывает его в каждый запрос к сервисам.

- Update NestJS
- Update TS
- Добавить глобальный async
- Добавить распределенный лок или saga для лока операций над Task

Сервис Auth

- Добавить скрипт для добавления новых пользователей через вызов скрипта. Для первого запуска и добавление новых пользователей не через web морду.

Для единой авторизации через api-gateway:
Должно происходить на api-gateway. Далее он авторизует пользователя и подкладывает его в каждый запрос к сервисам.

Использовать nestjs-config

# Troubleshooting

Мир пока не готов к pnpm и плоским node_modules.
Часто модули ипортируют части других модулей который не указаны в deps из-за чего yarn и pnpm не ликуют пакеты.

Пример такой ошибки:

```text
Error: Cannot find module 'fastify/lib/symbols'
Require stack:
- /Users/shreyner/workspace/popug-jira/node_modules/.store/middie-npm-6.0.0-4edfb178b4/node_modules/middie/index.js
- /Users/shreyner/workspace/popug-jira/node_modules/.store/@nestjs-platform-fastify-virtual-1c9265c3ae/node_modules/@nestjs/platform-fastify/adapters/fastify-adapter.js
- /Users/shreyner/workspace/popug-jira/node_modules/.store/@nestjs-platform-fastify-virtual-1c9265c3ae/node_modules/@nestjs/platform-fastify/adapters/index.js
- /Users/shreyner/workspace/popug-jira/node_modules/.store/@nestjs-platform-fastify-virtual-1c9265c3ae/node_modules/@nestjs/platform-fastify/index.js
- /Users/shreyner/workspace/popug-jira/dist/apps/auth/main.js
```

Конкретно в этом случае у модуля `middie` в зависимостях не указан `fastify`, но импортирует от туда `fastify/lib/symbols` и ловит проблему.

Решается:

`.yarnrc.yml`

```yaml
packageExtensions:
  middie@*:
    peerDependencies:
      fastify: '*'
```

Полезные ссылки:
[Yarn packageExtensions](https://yarnpkg.com/configuration/yarnrc#packageExtensions)
[Ссылка на issues в котором нашел решение](https://github.com/fastify/fastify-swagger/issues/220#issuecomment-581905878)

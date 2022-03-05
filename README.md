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

Сервис Auth
- Добавить скрипт для добавления новых пользователей через вызов скрипта. Для первого запуска и добавление новых пользователей не через web морду.

Для единой авторизации через api-gateway:
Должно происходить на api-gateway. Далее он авторизует пользователя и подкладывает его в каждый запрос к сервисам.

Использовать nestjs-config

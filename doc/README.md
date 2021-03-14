# Проектирование системы

## Содержание

- [Домашняя работа 1-2](#Дмашняя-работа-1-2). Результат EventStorm и модель данных.
- [Домашняя работа 3](#Домашняя-работа-3) Выделение сервисов по доменам из модели данных. Выделение синхронных, асинхронных бизнес и CUD событий.

# Домашняя работа 1-2

EventStorm и модель данных

Ссылка на miro [miro.com/app/board/o9J_lPzRfBA](https://miro.com/app/board/o9J_lPzRfBA=/) с eventStorm и моделью данных.

### Разбил бизнес требования на атомарные требования, по которым буду строить EventStorm:

- Задача создана.
- Задаче назначаем cost/reward.

- Менеджер асайнит все открытые задачи на сотрудников.
- Задача назначена.
- Отправляем пользователю нотификацию о назначенной задаче.
- Списываем cost c счета пользователя за назначенную на него задачу.
- Сотрудник закрыл задачу.
- Начисляем reward на счет пользователя.
- Выплатить пользователям деньги за день.
- Отправить нотификацию о закрытии периода и выплате.

### EventStorm

TODO: Добавить картинку со схемой EventStorm'а

Актор, команда и событие.

| Description                                                                    | Actor                  | Command                                                       | Data                            | Event           |
| ------------------------------------------------------------------------------ | ---------------------- | ------------------------------------------------------------- | ------------------------------- | --------------- |
| Регистрация пользователя                                                       | User                   | Create user in auth                                           | -                               | User.Registered |
| Создаем кошелек                                                                | _User.Registered_      | Create walet                                                  | User.id                         | -               |
| ---                                                                            | ---                    | ---                                                           | ---                             | ---             |
| Создание задачи                                                                | User                   | Create Task                                                   | -                               | Task.created    |
| Генерация cost/reward                                                          | _Task.created_         | Generate cost/reward for task                                 | task.id                         | -               |
| ---                                                                            | ---                    | ---                                                           | ---                             | ---             |
| Менеджер асайнит все открытые задачи на сотрудников                            | User with role Manager | Get all Task with status Open and assigned to User            | User.role + Tasks + Users       | Task.assigned   |
| Отправляем пользователю нотификацию о назначенной задаче (Асинхронно)          | _Task.assigned_        | Send notification                                             | Task + User                     | -               |
| Списываем cost c счета пользователя за назначенную на него задачу (Асинхронно) | _Task.assigned_        | Create transaction on Debit amount for User                   | Task.id + User.id + Cost/Reword | -               |
| ---                                                                            | ---                    | ---                                                           | ---                             | ---             |
| Сотрудник закрыл задачу                                                        | User                   | Change status Task to Close                                   | Task                            | Task.close      |
| Начисляем reward на счет пользователя                                          | _Task.closed_          | Create transaction on Credit amount front User                | Task.id + Reword                | -               |
| ---                                                                            | ---                    | ---                                                           | ---                             | ---             |
| Выплатить пользователям деньги за день                                         | Cyrcle close work day  | Get all user with plus amount and creat transaction on payout | Wallet                          | Account.Payout  |
| Отправить нотификацию о закрытии периода и выплате                             | _Account.Payout_       | Send notification about payout                                | Transacton                      | -               |

### Модель данных + Домены

TODO: Тут должна быть картинка

# Домашняя работа 3

Выделение сервисов по доменам из модели данных. Выделение синхронных, асинхронных бизнес и CUD событий

Домены:

- Auth domain - User + Role + Auth
- Task-tracker domain - Task + Status
- Accounting domain - Wallet + Transaction + Cycle + cost/reward

В **Popug-jira** будет 3 сервиса по трем доменам: Auth, Task-tracker, Accounting

### Способы коммуникации:

**Синхронные:**
Бизнес события:

- Команда из вне на регистрацию пользователя
- Команда из вне на создание задачи
- команда из вне на назначение всех задач

**Асинхронные:**
Бизнес события:
- Task.created
- Task.closed
- Task.assigned
- Account.Payout 

**CUD События:**
Для сущностей:
- User
- Task

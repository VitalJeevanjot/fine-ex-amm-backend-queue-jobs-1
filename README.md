# Fine Exchange AOM: queue service

Part of **Fine Exchange AOM**, an automated order manager for market makers that I built for my company, Fine Exchange Ltd, in 2022. The [client repository](https://github.com/VitalJeevanjot/Fine-Exchange-AMM) explains the whole system, with a diagram and the path a task takes through the services.

> **Status: shut down.** Fine Exchange closed in 2022 and the fine.exchange domain has expired, so it's no longer mine. Read the code, but don't run it with real API keys.

Turns a task into scheduled jobs. Each queue server (there were two, behind the load balancer) runs one copy of this service.

- On `/create_new_task` it reads the pair's order book through CCXT, then adds a delayed `createOrder` job to the BullMQ `tasks` queue on Redis.
- When a job completes, it records the order id with the database service and adds the next job after the task's interval, so a task keeps running until it's stopped. A failed job marks the task stopped.
- `SERVER_NAME` tags every log line with the server that ran the task.

## Endpoints

| Route | Does |
| --- | --- |
| `POST /create_new_task` | Schedule a new task |
| `POST /stop_task`, `POST /delete_task` | Routed to the same handler as `/create_new_task` |
| `GET /hello` | Health check |

`npm run list-tasks` and `npm run remove-tasks` list or clear the jobs in the queue.

## Environment

```
APIKEY=
APISECRET=
APIURL=
USER_NAME=
USER_PASSWORD=
DB_URL=
DB_PORT=
DB_NAME=
DB_TABLE_NAME_LOGS=
SERVER_DB_URL=           # database service
SERVER_DB_PORT=
SAVE_SERVICE_ENDPOINT=
SERVER_NAME=             # name shown in logs
REDIS_HOST=
REDIS_PORT=
ENCRYPT_KEY=             # cryptr key shared by the services
```

## The system

| Service | Repository |
| --- | --- |
| Client | [Fine-Exchange-AMM](https://github.com/VitalJeevanjot/Fine-Exchange-AMM) |
| Load balancer (the API the client calls) | [fine-ex-amm-backend-load-balancer](https://github.com/VitalJeevanjot/fine-ex-amm-backend-load-balancer) |
| Queue service | [fine-ex-amm-backend-queue-jobs-1](https://github.com/VitalJeevanjot/fine-ex-amm-backend-queue-jobs-1) |
| Worker | [fine-ex-amm-backend-worker-jobs-1](https://github.com/VitalJeevanjot/fine-ex-amm-backend-worker-jobs-1) |
| Database service | [fine-ex-amm-backend](https://github.com/VitalJeevanjot/fine-ex-amm-backend) |

## Running it

```bash
npm install
npm run dev      # nodemon on app.ts
npm run build    # compile to dist/
npm start        # node dist/app.js
```

Each service listens on port 8080. `okteto.yml` and `dockerfile` are the Okteto development environment it ran in.

Built by [Jeevanjot Singh Vital](https://jeevanjotsinghvital.com).

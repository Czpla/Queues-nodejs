import 'dotenv/config';
import express from "express";

import UserController from './app/controllers/UserController';
import createBullBoard from '@bull-board/api'
import ExpressAdapter from '@bull-board/express';

import Queue from './app/lib/Queue';

const app = express();

const serverAdapter = new ExpressAdapter();

const { addQueue, removeQueue, setQueues, replaceQueues } = createBullBoard({
    queues: Queue.queues.map(queue => queue.bull),
    serverAdapter:serverAdapter
});

// BullBoard. (Queue.queues.map(queue => queue.bull));

app.use(express.json());

app.post('/users', UserController.store);

app.use('/admin/queues', serverAdapter.getRouter());

app.listen(3333, () => {
    console.log("Server running on localhost:3333");
});
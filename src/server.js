import 'dotenv/config';
import express from "express";

import UserController from './app/controllers/UserController';
import { createBullBoard } from '@bull-board/api'
import { ExpressAdapter } from '@bull-board/express';
import { BullAdapter } from '@bull-board/api/bullAdapter';

import Queue from './app/lib/Queue';

const app = express();

const serverAdapter = new ExpressAdapter();

serverAdapter.setBasePath('/admin/queues')

createBullBoard({
    queues: Queue.queues.map(queue => new BullAdapter(queue.bull)),
    serverAdapter:serverAdapter
});

app.use(express.json());

app.post('/users', UserController.store);

app.use('/admin/queues', serverAdapter.getRouter());

app.listen(3333, () => {
    console.log("Server running on localhost:3333");
});
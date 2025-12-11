import express, { type Express } from 'express';
import appRouter from '#app/app.router';

const app: Express = express();

app.use(appRouter);

export default app;

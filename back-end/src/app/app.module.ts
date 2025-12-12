import express, { type Express } from 'express';
import appRouter from '#app/app.router';
import cors from 'cors';
import config from "#config/config";

const app: Express = express();

app.use(cors({
  origin: config.webUrl,
}));
app.use(appRouter);

export default app;

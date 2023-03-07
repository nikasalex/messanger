import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { AppDataSource } from './data_source';
import routerAuth from './rest/routes/authorization';
import 'reflect-metadata';
import { Authmiddleware } from './middlewares/Authmiddleware';
import cookieParser from 'cookie-parser';
import { createClient } from 'redis';

export const client = createClient()


const PORT = process.env.PORT ?? 3000;

client.on('error', err=>console.log('Redis client Error',err));

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(Authmiddleware);
app.use(routerAuth);

AppDataSource.initialize()
  .then(() => {
    client.connect() //del
    console.log('Databse has been initialized');
    app.listen(PORT, () => {
      console.log(`Server has been stated on ${PORT}`);
    });
  })
  .catch((err) => {
    console.error(`Error`, err);
  });

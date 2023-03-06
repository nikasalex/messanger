import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { AppDataSource } from './data_source';
import router from './routes/messenger';
import 'reflect-metadata';
import { Authmiddleware } from './middlewares/Authmiddleware';
import cookieParser from 'cookie-parser';

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(Authmiddleware);
app.use(router);

AppDataSource.initialize()
  .then(() => {
    console.log('Databse has been initialized');
    app.listen(PORT, () => {
      console.log(`Server has been stated on ${PORT}`);
    });
  })
  .catch((err) => {
    console.error(`Error`, err);
  });

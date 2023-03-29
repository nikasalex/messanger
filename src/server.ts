import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { AppDataSource } from './data_source';
import routerAuth from './rest/routes/authorization';
import routerMs from './rest/routes/messenger';
import 'reflect-metadata';
import { Authmiddleware } from './middlewares/Authmiddleware';
import cookieParser from 'cookie-parser';
import { createClient } from 'redis';
import cors from 'cors';
import { Server } from 'socket.io';
import http from 'http';

const DOMAIN = process.env.B_DOMAIN
const PORT = process.env.PORT ?? 3000;
const FPORT = process.env.FPORT
const app = express();
const server = http.createServer(app);
export const io = new Server(server,{
  cors: {
    origin: `http://${DOMAIN}:${FPORT}`,
    credentials: true
  }
});

export const client = createClient();

client.on('error', (err) => console.log('Redis client Error', err));

app.use(cors({ credentials: true, origin: `http://${DOMAIN}:${FPORT}` }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(Authmiddleware);
app.use(routerAuth);
app.use(routerMs);


io.on('connection', (socket)=>{
  console.log('A user connected');
  
})
io.on('disconnect',(sosket)=>{
  console.log('User disconect');
  
})


AppDataSource.initialize()
  .then(() => {
    client.connect();
    console.log('Databse has been initialized');
    server.listen(PORT, () => {
      console.log(`Server has been stated on ${PORT}`);
    });
  })
  .catch((err) => {
    console.error(`Error`, err);
  });

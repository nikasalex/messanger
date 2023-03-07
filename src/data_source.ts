import { DataSource } from 'typeorm';
import formData from 'form-data';
import Mailgun from 'mailgun.js';


const api = process.env.MG_API;




const mailgun = new Mailgun(formData);
export const mg = mailgun.client({
  username: 'api',
  key: api,
});

const DB_TYPE: any = process.env.DB_TYPE || 'mysql';

export const AppDataSource = new DataSource({
  type: DB_TYPE,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT) as number,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: ['src/entity/*.ts'],
  synchronize: true,
});

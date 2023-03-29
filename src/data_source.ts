import { DataSource } from 'typeorm';
import formData from 'form-data';
import path from 'path'
import nodemailer  from 'nodemailer'

const x = path.join( __dirname, 'entity', '*.{js,ts}' )

export const mg = nodemailer.createTransport({
  host: process.env.SM_HOST,
  port: 465,
  secure: true, 
  auth: {
    user: process.env.SM_USER,
    pass: process.env.SM_PASS,
  }
})






const DB_TYPE: any = process.env.DB_TYPE || 'mysql';

export const AppDataSource = new DataSource({
  type: DB_TYPE,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT) as number,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [x],
  synchronize: true,
});

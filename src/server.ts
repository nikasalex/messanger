import  express from 'express'
import { AppDataSource } from '../data_source'
import  router from '../routes/messenger'
import 'reflect-metadata'
import  {Authmiddleware}   from '../middlewares/Authmiddleware'
import  cookieParser  from 'cookie-parser' 


const app = express()
 
app.use(express.json());
app.use(router);
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser())
app.use(Authmiddleware)







AppDataSource.initialize()
    .then(()=>{
        console.log('Databse has been initialized');
        app.listen(3000,()=>{
            console.log('Server has been stated on 3000');
            
        })
        
    })
    .catch((err)=>{
        console.error(`Error`, err);
        
    })






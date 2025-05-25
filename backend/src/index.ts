import express from 'express';
import dotenv from 'dotenv';
import connectDb from './config/db';

dotenv.config()

const app = express();

app.use(express.json());

connectDb();

const port = process.env.port || 3000;
app.listen(port,()=>{
    console.log(`server is running in port ${port}`);
    
})
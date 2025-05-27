import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDb from './config/db';
import LoginRoute from './routers/LoginRoute';

dotenv.config();

const app = express();

app.use(cors({
  origin: 'http://localhost:5173', // change to your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true,
}));

app.use(express.json());

connectDb();

app.use("/auth", LoginRoute);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';

import userRoutes from './src/routes/user-routes';

const app = express();

dotenv.config();

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

app.use('/user', userRoutes)










mongoose.set('strictQuery', false);
mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => {
    app.listen(process.env.PORT || 5000);
  })
  .catch((err: string) => console.log(err));

import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';

const app = express();

dotenv.config();

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

mongoose.set('strictQuery', false);
mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => {
    app.listen(process.env.PORT || 5000);
  })
  .catch((err: string) => console.log(err));

import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import passport from 'passport';
import session from 'express-session';

import userRoutes from './src/routes/user-routes';
import { User } from './src/types/userTypes';
import { UserModel } from './src/models/user';

const app = express();

dotenv.config();
type _User = User;

declare global {
  namespace Express {
    interface User extends _User {}
  }
}

app.use(
  session({
    secret: `${process.env.SECRET_KEY}`,
    resave: false,
    saveUninitialized: true,
  }),
);
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(UserModel.serializeUser());
passport.deserializeUser(UserModel.deserializeUser());
app.use('/user', userRoutes);

mongoose.set('strictQuery', false);
mongoose
  .connect(`${process.env.MONGO_URI}`)
  .then(() => {
    app.listen(process.env.PORT || 5000);
  })
  .catch((err: string) => console.log(err));

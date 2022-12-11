import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import passport from 'passport';
import session from 'express-session';

import userRoutes from './src/routes/user-routes';
import { UserInterface } from './src/types/userTypes';
import { UserModel } from './src/models/user';

// import { UserModel } from './src/models/user';

// import {Strategy as LocalStrategy} from 'passport-local';

const app = express();

dotenv.config();
type _User = UserInterface;

declare global {
  namespace Express {
    interface User extends _User {}
  }
}

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: `${process.env.SECRET_KEY}`,
    resave: false,
    saveUninitialized: true,
  }),
);
app.use(passport.initialize());
app.use(passport.session());
// passport.use(new LocalStrategy(UserModel.authenticate()));
// passport.use(UserModel.createStrategy());
passport.serializeUser(UserModel.serializeUser());
passport.deserializeUser(UserModel.deserializeUser());

app.get('/', (_req, res) => {
  res.send('Welcome on my backend part');
});
app.use('/user', userRoutes);

mongoose.set('strictQuery', false);
mongoose
  .connect(`${process.env.MONGO_URI}`)
  .then(() => {
    app.listen(process.env.PORT || 5000);
  })
  .catch((err: string) => console.log(err));

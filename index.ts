import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import passport from 'passport';
import session from 'express-session';
import { Strategy as LocalStrategy } from 'passport-local';

import userRoutes from './src/routes/user-routes';
import UserModel, { UserDoc } from './src/models/user';

const app = express();

dotenv.config();
type _User = UserDoc;

declare global {
  namespace Express {
    interface User extends _User {}
  }
}
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
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

passport.serializeUser(UserModel.serializeUser());
passport.deserializeUser(UserModel.deserializeUser());
passport.use(
  new LocalStrategy({ usernameField: 'email' }, UserModel.authenticate()),
);

app.get('/', (_req, res) => {
  res.send('Welcome on my space-backend part');
});

app.use('/user', userRoutes);

mongoose.set('strictQuery', false);
mongoose
  .connect(`${process.env.MONGO_URI}`)
  .then(() => {
    app.listen(process.env.PORT || 5000);
  })
  .catch((res) =>
    res
      .status(503)
      .json({ message: 'Connection error. Please try again later' }),
  );

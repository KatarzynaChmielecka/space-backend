import passportLocalMongoose from 'passport-local-mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import { Schema, model } from 'mongoose';

// export interface UserInterface {
//   // body: any;
//   // toObject(arg0: { getters: boolean }): any;
//   name: string;
//   email: string;
//   password: string;
//   image: string;
// }

const options = {
  errorMessages: {
    MissingPasswordError: 'No password was given',
    AttemptTooSoonError: 'Account is currently locked. Try again later',
    TooManyAttemptsError:
      'Account locked due to too many failed login attempts',
    NoSaltValueStoredError: 'Authentication not possible. No salt value stored',
    IncorrectPasswordError: 'Password or username are incorrect',
    IncorrectUsernameError: 'Password or username are incorrect',
    MissingUsernameError: 'No username was given',
    UserExistsError:
      'You are trying to register existing user. Try login instead',
  },
};

const userSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  // password: { type: String, required: true, minlength: 8 },
  image: { type: String, required: true },
});

userSchema.plugin(uniqueValidator);
userSchema.plugin(
  passportLocalMongoose,
  {
    usernameField: 'email', // Ustawienie pola "email" jako pole używane do logowania
    options
  },
);

export const User = model('User', userSchema);

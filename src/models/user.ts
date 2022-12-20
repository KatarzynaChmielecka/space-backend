import passportLocalMongoose from 'passport-local-mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import { Document, PassportLocalModel, Schema, model } from 'mongoose';

interface UserInterface {
  username: string;
  email: string;
  password: string;
  avatar: string;
}
export interface UserDoc extends UserInterface, Document {}
interface UserModel extends PassportLocalModel<UserDoc> {}

const options = {
  errorMessages: {
    IncorrectPasswordError: 'Invalid credentials',
    IncorrectUsernameError: 'Invalid credentials',
    UserExistsError: 'User exists. Try login instead',
  },
};

const userSchema = new Schema<UserDoc>({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  avatar: { type: String, required: true },
});

userSchema.plugin(uniqueValidator);
userSchema.plugin(passportLocalMongoose, {
  usernameField: 'email', //field email will be used to register/login, not username
  ...options,
});

export default model<UserDoc, UserModel>('User', userSchema);

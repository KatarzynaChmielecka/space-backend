import passportLocalMongoose from 'passport-local-mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import { Document, PassportLocalModel, Schema, model } from 'mongoose';

interface UserInterface {
  username: string;
  email: string;
  password: string;
  // authenticate: (password: string) => Promise<boolean>;
  changePassword: (password: string, newPasswordConfirmation: string) => void;
  // comparePassword: (
  //   password: string,
  //   callback: (err: Error | null |string |undefined, isMatch?: boolean) => void
  // ) => void;
  avatar: string | Blob;
  images?: string[] | Blob[];
}
export interface UserDoc extends UserInterface, Document {
  // authenticate(password: string): boolean;

  authenticate(
    password: string,
    cb: (err?: Error | null, user?: this, passwordErr?: Error | null) => void
  ): void;
}
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
  images: { type: [String], required: false },
});

userSchema.plugin(uniqueValidator);
userSchema.plugin(passportLocalMongoose, {
  usernameField: 'email', //field email will be used to register/login, not username
  ...options,
});

export default model<UserDoc, UserModel>('User', userSchema);

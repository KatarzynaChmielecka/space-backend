import uniqueValidator from 'mongoose-unique-validator';
import { Schema, model } from 'mongoose';

export interface UserInterface {
  toObject(arg0: { getters: boolean }): any;
  name: string;
  email: string;
  password: string;
  image: string;
}

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 },
  image: { type: String, required: true },
});

userSchema.plugin(uniqueValidator);

export const User = model<UserInterface>('User', userSchema);


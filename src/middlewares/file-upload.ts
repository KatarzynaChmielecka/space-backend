const cloudinary = require('cloudinary').v2;

import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

interface Params {
  folder: string;
}
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'space-backend',
  } as Params,
});

export const fileUpload = multer({ storage: storage });

// module.exports = fileUpload;

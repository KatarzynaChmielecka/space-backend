import cloudinary from 'cloudinary';

import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

interface Params {
  folder: string;
}
cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary.v2,
  params: {
    folder: 'space-backend',
  } as Params,
});

export const fileUpload = multer({ storage: storage });

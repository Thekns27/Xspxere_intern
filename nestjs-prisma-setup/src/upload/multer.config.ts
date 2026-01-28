import { BadRequestException } from "@nestjs/common";
import { diskStorage } from "multer";
import { extname } from "path";

export const createMulterConfig = (maxFiles: number, fileTypes: string[]) => ({
  storage: diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
      const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, uniqueName + extname(file.originalname));
    },
  }),
  limits: {
    files: maxFiles,
    fileSize: 2 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const ext = extname(file.originalname).replace('.', '').toLowerCase();

    if (!fileTypes.includes(ext)) {
      return cb(
        new BadRequestException(
          `Invalid file type. Allowed types: ${fileTypes.join(', ')}`,
        ),
        false,
      );
    }
    cb(null, true);
  },
});
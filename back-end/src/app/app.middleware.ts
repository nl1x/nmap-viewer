import type { Request, Response, NextFunction, RequestHandler } from 'express';
import type AppException from '#exceptions/exceptions';
import { BadRequestException } from '#exceptions/exceptions';
import multer from 'multer';

export default class AppMiddleware {

  static errorHandler(err: AppException, req: Request, res: Response, next: NextFunction) {
    res.status(err.status || 500).json({
      message: err.message || 'Internal Server Error',
    });
  }

  static uploadFiles(fieldName: string, destinationPath: string, authorizedMimeTypes: string[], count: number = 10): RequestHandler {
    const storage = multer({
      storage: multer.diskStorage({
        destination: async function (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) {
          cb(null, destinationPath);
        },
        filename: async function (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) {
          if (!authorizedMimeTypes.includes(file.mimetype)) {
            cb(new BadRequestException(`Only ${authorizedMimeTypes.join(', ')} ${authorizedMimeTypes.length > 1 ? 'are' : 'is'} supported. (Got ${file.filename})`), '');
            return;
          }
          cb(null, file.originalname);
        }
      })
    });

    return storage.array(fieldName);
  }

}

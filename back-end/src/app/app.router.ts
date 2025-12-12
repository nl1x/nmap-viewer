import { Router } from "express";
import AppController from '#app/app.controller';
import AppMiddleware from '#app/app.middleware';

const router: Router = Router();

router.get('/hosts', AppController.getHosts);
router.post('/upload', AppMiddleware.uploadFiles('files', 'uploads/', ['text/plain']), AppController.upload);
router.use(AppMiddleware.errorHandler);

export default router;

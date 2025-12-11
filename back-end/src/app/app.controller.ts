import type { Request, Response } from 'express';
import { BadRequestException } from "#exceptions/exceptions";
import {NmapParser} from "../utils/nmap-parser.js";
import AppService from '#app/app.service';

/**
 * @brief The application controller.
 * @note Endpoint: /
 */
export default class AppController {

  /**
   * @brief POST /upload : Upload multiple files.
   *
   * @param req The request object containing the uploaded files.
   * @param res The response object.
   */
  static async upload(req: Request, res: Response) {
    if (!req.files)
      throw new BadRequestException('You need to provide a nmap file.');

    const files = Array.isArray(req.files) ? req.files : Object.values(req.files || {}).flat();

    for (const file of files) {
      const parser = NmapParser.parse(`${file.destination}/${file.filename}`);
      await AppService.saveHosts(parser);
    }

    res.json({
      message: "Files processed successfully.",
    });
  }
}

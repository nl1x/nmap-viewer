export default interface AppException extends Error {
  status?: number;
}

export class BadRequestException extends Error implements AppException {
  status = 400;
  name = 'BadRequest';

  constructor(message: string) {
    super(message);
  }
}

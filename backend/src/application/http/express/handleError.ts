import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';

function handleResponseErrorHttp(err: any) {
  const RESPONSE_STATUS_CODE: any = {
    'NotFoundError': StatusCodes.NOT_FOUND,
    'BusinessError': StatusCodes.UNPROCESSABLE_ENTITY,
    'DuplicateRecordError': StatusCodes.CONFLICT
  }

  const statusCode = RESPONSE_STATUS_CODE[err?.constructor?.name];

  if (statusCode) {
    return {
      statusCode,
      message: err.message
    };
  } 

  return { statusCode: StatusCodes.INTERNAL_SERVER_ERROR, message: 'Internal server error' };
}

export function handleError(err: any, res: Response) {
  console.error(err);
  const { statusCode, message } = handleResponseErrorHttp(err);
  return res.status(statusCode).json({ message });
}
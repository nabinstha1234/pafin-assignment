import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';

import { IError } from '../interfaces/IError';
import { TYPES } from '../types';
import { IErrorService } from '../interfaces/services/IErrorService';
import container from '../inversify.config';

const errorService: IErrorService = container.get<IErrorService>(TYPES.ErrorService);

export default (err: IError, req: Request, res: Response, next: NextFunction) => {
  let error = errorService.getError({
    err,
    logError: false,
    name: 'errorHandler',
    operation: 'middleware.handleError',
  });

  if (error.code) {
    if (typeof error.code === 'number') {
      return res.status(error.code).send({
        message: error.message ? error.message : 'internalServerError',
        details: error?.details?.map((detail) => detail),
        data: error.data,
      });
    } else {
      return res.status(500).send({
        message: 'internalServerError',
        details: ['internalServerError'],
        data: error.data,
      });
    }
  } else {
    return res.status(500).send({
      message: 'internalServerError',
      details: 'internalServerError',
      data: error.data,
    });
  }
};

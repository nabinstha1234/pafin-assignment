import Joi from 'joi';

import config from '../config';

const translationKey = config.translationKey;

const messages = {
  email: {
    'string.base': translationKey.emailRequired,
    'string.empty': translationKey.emailRequired,
    'string.email': translationKey.invalidEmail,
    'any.required': translationKey.emailRequired,
  },
  password: {
    'string.base': translationKey.passwordValidation,
    'string.empty': translationKey.passwordValidation,
    'any.required': translationKey.passwordValidation,
  },
  name: {
    'string.base': translationKey.nameValidation,
    'string.empty': translationKey.nameValidation,
    'string.required': translationKey.nameValidation,
  },

  token: {
    'string.base': translationKey.tokenValidation,
    'string.empty': translationKey.tokenValidation,
    'string.required': translationKey.tokenValidation,
  },
};

export default class AuthValidation {
  static login() {
    return Joi.object({
      email: Joi.string().required().email().messages(messages.email),

      password: Joi.string().required().messages(messages.password),
    });
  }
}

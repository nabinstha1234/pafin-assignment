import Joi from 'joi';
import config from '../config';

const translationKey = config.translationKey;

const messages = {
  nameUpdate: {
    'string.base': translationKey.nameValidation,
    'string.empty': translationKey.nameValidation,
    'string.required': translationKey.nameValidation,
    'any.required': translationKey.nameValidation,
  },
  email: {
    'string.base': translationKey.emailRequired,
    'string.empty': translationKey.emailRequired,
    'string.required': translationKey.emailRequired,
    'any.required': translationKey.emailRequired,
    'string.email': translationKey.invalidEmail,
  },
  password: {
    'string.base': translationKey.passwordValidation,
    'string.empty': translationKey.passwordValidation,
    'string.required': translationKey.passwordValidation,
    'any.required': translationKey.passwordValidation,
  },
  nameCreate: {
    'string.base': translationKey.nameValidation,
    'string.empty': translationKey.nameValidation,
    'string.required': translationKey.nameValidation,
    'any.required': translationKey.nameValidation,
  },
};

export default class UserValidation {
  static update() {
    return Joi.object({
      name: Joi.string().required().messages(messages.nameUpdate),
      email: Joi.string().messages(messages.nameUpdate),
    });
  }

  static create() {
    return Joi.object({
      email: Joi.string().required().email().messages(messages.email),
      password: Joi.string().required().messages(messages.password),
      name: Joi.string().required().messages(messages.nameCreate),
    });
  }

  static changePassword() {
    return Joi.object({
      oldPassword: Joi.string().required().messages(messages.password),
      password: Joi.string().required().messages(messages.password),
    });
  }
}

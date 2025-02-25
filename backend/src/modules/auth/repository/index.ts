import RepositoryFactory from '../../../tools/abstract/repository.js';
import AuthModel from '../model.js';
import type { EControllers } from '../../../enums/controller.js';
import type { IAuth } from '../types.js';

export default class AuthRepository extends RepositoryFactory<IAuth, typeof AuthModel, EControllers.Auth> {
  constructor() {
    super(AuthModel);
  }
}

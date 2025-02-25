import RepositoryFactory from '../../../tools/abstract/repository.js';
import UserModel from '../model.js';
import type { EControllers } from '../../../enums/controller.js';
import type { IUser } from '../types.js';

export default class UserRepository extends RepositoryFactory<IUser, typeof UserModel, EControllers.User> {
  constructor() {
    super(UserModel);
  }
}

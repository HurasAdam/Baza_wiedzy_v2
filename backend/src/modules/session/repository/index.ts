import RepositoryFactory from '../../../tools/abstract/repository.js';
import SessionModel from '../model.js';
import type { EControllers } from '../../../enums/controller.js';
import type { ISession } from '../types.js';

export default class SessionRepository extends RepositoryFactory<ISession, typeof SessionModel, EControllers.Session> {
  constructor() {
    super(SessionModel);
  }
}

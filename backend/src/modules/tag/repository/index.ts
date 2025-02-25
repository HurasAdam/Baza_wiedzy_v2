import RepositoryFactory from '../../../tools/abstract/repository.js';
import TagModel from '../model.js';
import type { EControllers } from '../../../enums/controller.js';
import type { ITag } from '../types.js';

export default class TagRepository extends RepositoryFactory<ITag, typeof TagModel, EControllers.Tag> {
  constructor() {
    super(TagModel);
  }
}

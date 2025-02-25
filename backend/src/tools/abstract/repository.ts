import type { EControllers } from '../../enums/controller.js';
import type * as types from '../../types/index.js';
import type { Document, FilterQuery, Model, UpdateQuery } from 'mongoose';

export default abstract class RepositoryFactory<T extends Document, U extends Model<T>, Z extends EControllers>
  implements types.IAbstractRepository<Z>
{
  private readonly _model: U;

  constructor(model: U) {
    this._model = model;
  }

  get model(): U {
    return this._model;
  }

  async getById(_id: string): Promise<types.IOptional<types.IRepositoryGetData[Z]>> {
    return this.model
      .findOne({ _id } as FilterQuery<Partial<types.IRepositoryGetData[Z]>>)
      .lean<types.IRepositoryGetData[Z] | null>();
  }

  async get(data: FilterQuery<Partial<types.IRepositoryGetData[Z]>>): Promise<types.IRepositoryGetManyData[Z]> {
    return this.model.find(data).lean<types.IRepositoryGetManyData[Z]>();
  }

  async add(data: types.IRepositoryAddData[Z]): Promise<string> {
    const newElement = new this.model(data);
    const callback = await newElement.save();

    return callback._id as string;
  }

  async count(filter: FilterQuery<Partial<types.IRepositoryGetData[Z]>>): Promise<number> {
    return this.model.countDocuments(filter);
  }

  async update(id: string, data: UpdateQuery<types.IRepositoryUpdate[Z]>): Promise<void> {
    // @ts-expect-error I don't feel like working with this now...
    await this.model.findOneAndUpdate({ _id: id } as FilterQuery<Partial<types.IRepositoryGetData[Z]>>, data);
  }

  async remove(id: string): Promise<void> {
    await this.model.findOneAndDelete({ _id: id } as FilterQuery<Partial<types.IRepositoryGetData[Z]>>);
  }

  async removeMany(filter: FilterQuery<Partial<types.IRepositoryGetData[Z]>>): Promise<void> {
    await this.model.findOneAndDelete(filter);
  }
}

import fakeData from './index.json';
import Article from '../../../src/modules/article/models/schema.js';
import User from '../../../src/modules/user/model.js';

export default class FakeGenerator {
  private static accessor createdData: { type: string; id: string }[] = [];

  static async createUser(): Promise<string> {
    const newElement = new User(fakeData.data.users[0]);
    const callback = await newElement.save();

    const id = callback._id.toString();

    FakeGenerator.createdData.push({ type: 'user', id });
    return id;
  }

  static async createArticle(): Promise<string> {
    const newElement = new Article(fakeData.data.article[0]);
    const callback = await newElement.save();

    const id = callback._id.toString();

    FakeGenerator.createdData.push({ type: 'user', id });
    return id;
  }

  static async cleanup(): Promise<void> {
    if (FakeGenerator.createdData.length === 0) return;

    await Promise.all(FakeGenerator.createdData.map((e) => FakeGenerator.removeElement(e.type, e.id)));
    FakeGenerator.createdData = [];
  }

  private static async removeElement(type: string, _id: string): Promise<void> {
    switch (type) {
      case 'user':
        await User.findOneAndDelete({ _id });
        break;
      case 'article':
        await Article.findOneAndDelete({ _id });
        break;
      default:
        break;
    }
  }
}

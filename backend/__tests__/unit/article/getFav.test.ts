import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';
import Mongo from '../../../src/connections/mongoose/index.js';
import { IncorrectArgLengthError, IncorrectArgTypeError, MissingArgError } from '../../../src/errors/index.js';
import GetFavoriteArticlesDto from '../../../src/modules/article/subModules/favorite/get/dto.js';
import getFavoriteArticles from '../../../src/modules/article/subModules/favorite/get/index.js';
import State from '../../../src/tools/state.js';
import FakeGenerator from '../../utils/fakeData/generator.js';
import fakeData from '../../utils/fakeData/index.json';
import { generateRandomName } from '../../utils/index.js';
import type { IGetFavArticlesDto } from '../../../src/modules/article/subModules/favorite/get/types.js';
import type { IFullError } from '../../../src/types/errors.js';
import { afterEach } from 'node:test';

describe('Get fav article', () => {
  const baseDto: IGetFavArticlesDto = {
    page: '1',
    userId: fakeData.data.users[0]!._id,
  };

  beforeAll(async () => {
    State.mongo = new Mongo();
    await State.mongo.init();
  });

  afterEach(async () => {
    await FakeGenerator.cleanup();
  });

  afterAll(() => {
    State.mongo.disconnect();
  });

  describe('Should throw', () => {
    describe('No data passed', () => {
      it('Missing userId', async () => {
        let error: IFullError | undefined = undefined;
        const target = new MissingArgError('userId');

        const data = structuredClone<Partial<IGetFavArticlesDto>>(baseDto);
        delete data.userId;

        try {
          const dto = new GetFavoriteArticlesDto(data as IGetFavArticlesDto);
          await getFavoriteArticles(dto);
        } catch (err) {
          error = err as IFullError;
        }

        expect(error?.message).toEqual(target.message);
      });
    });

    describe('Incorrect data', () => {
      it('Page is number', async () => {
        let error: IFullError | undefined = undefined;
        const target = new IncorrectArgTypeError('page should be a string');

        const data = structuredClone<Partial<IGetFavArticlesDto>>(baseDto);
        data.page = 2 as unknown as string;

        try {
          const dto = new GetFavoriteArticlesDto(data as IGetFavArticlesDto);
          await getFavoriteArticles(dto);
        } catch (err) {
          error = err as IFullError;
        }

        expect(error?.message).toEqual(target.message);
      });

      it('UserId is not a string', async () => {
        let error: IFullError | undefined = undefined;
        const target = new IncorrectArgTypeError('userId should be a string');

        const data = structuredClone<Partial<IGetFavArticlesDto>>(baseDto);
        data.userId = 1 as unknown as string;

        try {
          const dto = new GetFavoriteArticlesDto(data as IGetFavArticlesDto);
          await getFavoriteArticles(dto);
        } catch (err) {
          error = err as IFullError;
        }

        expect(error?.message).toEqual(target.message);
      });

      it('UserId is too short', async () => {
        let error: IFullError | undefined = undefined;
        const target = new IncorrectArgLengthError('userId', 24, 24);

        const data = structuredClone<Partial<IGetFavArticlesDto>>(baseDto);
        data.userId = '';

        try {
          const dto = new GetFavoriteArticlesDto(data as IGetFavArticlesDto);
          await getFavoriteArticles(dto);
        } catch (err) {
          error = err as IFullError;
        }

        expect(error?.message).toEqual(target.message);
      });

      it('UserId is too long', async () => {
        let error: IFullError | undefined = undefined;
        const target = new IncorrectArgLengthError('userId', 24, 24);

        const data = structuredClone<Partial<IGetFavArticlesDto>>(baseDto);
        data.userId = generateRandomName(25);

        try {
          const dto = new GetFavoriteArticlesDto(data as IGetFavArticlesDto);
          await getFavoriteArticles(dto);
        } catch (err) {
          error = err as IFullError;
        }

        expect(error?.message).toEqual(target.message);
      });

      it('UserId is not objectId', async () => {
        let error: IFullError | undefined = undefined;
        const target = new IncorrectArgTypeError('userId should be objectId');

        const data = structuredClone<Partial<IGetFavArticlesDto>>(baseDto);
        data.userId = generateRandomName(24);

        try {
          const dto = new GetFavoriteArticlesDto(data as IGetFavArticlesDto);
          await getFavoriteArticles(dto);
        } catch (err) {
          error = err as IFullError;
        }

        expect(error?.message).toEqual(target.message);
      });
    });
  });

  describe('Should pass', () => {
    it('Pass', async () => {
      await FakeGenerator.createUser();

      const dto = new GetFavoriteArticlesDto(baseDto);
      const data = await getFavoriteArticles(dto);

      expect(fakeData.data.favArticles[0]!.favouriteArticles).toEqual(data.favouriteArticles);
      expect(fakeData.data.favArticles[0]!.totalFavouriteArticles).toEqual(data.totalFavouriteArticles);
      expect(fakeData.data.favArticles[0]!.pageNumber).toEqual(data.pageNumber);
      expect(fakeData.data.favArticles[0]!.pageSize).toEqual(data.pageSize);
    });
  });
});

import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';
import Mongo from '../../../src/connections/mongoose/index.js';
import { IncorrectArgLengthError, IncorrectArgTypeError, MissingArgError } from '../../../src/errors/index.js';
import MarkFavDto from '../../../src/modules/article/subModules/favorite/mark/dto.js';
import markFavoriteArticle from '../../../src/modules/article/subModules/favorite/mark/index.js';
import State from '../../../src/tools/state.js';
import FakeGenerator from '../../utils/fakeData/generator.js';
import fakeData from '../../utils/fakeData/index.json';
import * as utils from '../../utils/index.js';
import type { IMarkFavReq } from '../../../src/connections/server/modules/article/markFavorite/types.js';
import type { IFullError } from '../../../src/types/errors.js';
import { afterEach } from 'node:test';

describe('Mark fav article', () => {
  const baseDto = {
    params: {
      id: fakeData.data.article[0]!._id,
    },
    userId: fakeData.data.users[0]!._id,
  } as unknown as IMarkFavReq & { userId: string };

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

        const data = structuredClone<Partial<IMarkFavReq & { userId: string }>>(baseDto);
        delete data.userId;

        try {
          const dto = new MarkFavDto(data as IMarkFavReq);
          await markFavoriteArticle(dto);
        } catch (err) {
          error = err as IFullError;
        }

        expect(error?.message).toEqual(target.message);
      });

      it('Missing id', async () => {
        let error: IFullError | undefined = undefined;
        const target = new MissingArgError('id');

        const data = structuredClone<Partial<IMarkFavReq & { userId: string }>>(baseDto);
        // @ts-expect-error Ignored because not required
        delete data.params.id;

        try {
          const dto = new MarkFavDto(data as IMarkFavReq);
          await markFavoriteArticle(dto);
        } catch (err) {
          error = err as IFullError;
        }

        expect(error?.message).toEqual(target.message);
      });
    });

    describe('Incorrect data', () => {
      it('UserId is number', async () => {
        let error: IFullError | undefined = undefined;
        const target = new IncorrectArgTypeError('userId should be a string');

        const data = structuredClone<Partial<IMarkFavReq & { userId: string }>>(baseDto);
        data.userId = 2 as unknown as string;

        try {
          const dto = new MarkFavDto(data as IMarkFavReq);
          await markFavoriteArticle(dto);
        } catch (err) {
          error = err as IFullError;
        }

        expect(error?.message).toEqual(target.message);
      });

      it('UserId is too short', async () => {
        let error: IFullError | undefined = undefined;
        const target = new IncorrectArgLengthError('userId', 24, 24);

        const data = structuredClone<Partial<IMarkFavReq & { userId: string }>>(baseDto);
        data.userId = '1';

        try {
          const dto = new MarkFavDto(data as IMarkFavReq);
          await markFavoriteArticle(dto);
        } catch (err) {
          error = err as IFullError;
        }

        expect(error?.message).toEqual(target.message);
      });

      it('UserId is too long', async () => {
        let error: IFullError | undefined = undefined;
        const target = new IncorrectArgLengthError('userId', 24, 24);

        const data = structuredClone<Partial<IMarkFavReq & { userId: string }>>(baseDto);
        data.userId = utils.generateRandomName(25);

        try {
          const dto = new MarkFavDto(data as IMarkFavReq);
          await markFavoriteArticle(dto);
        } catch (err) {
          error = err as IFullError;
        }

        expect(error?.message).toEqual(target.message);
      });

      it('UserId is not objectId', async () => {
        let error: IFullError | undefined = undefined;
        const target = new IncorrectArgTypeError('userId should be objectId');

        const data = structuredClone<Partial<IMarkFavReq & { userId: string }>>(baseDto);
        data.userId = utils.generateRandomName(24);

        try {
          const dto = new MarkFavDto(data as IMarkFavReq);
          await markFavoriteArticle(dto);
        } catch (err) {
          error = err as IFullError;
        }

        expect(error?.message).toEqual(target.message);
      });

      it('Id is number', async () => {
        let error: IFullError | undefined = undefined;
        const target = new IncorrectArgTypeError('id should be a string');

        const data = structuredClone<Partial<IMarkFavReq & { userId: string }>>(baseDto);
        data.params!.id = 1 as unknown as string;

        try {
          const dto = new MarkFavDto(data as IMarkFavReq);
          await markFavoriteArticle(dto);
        } catch (err) {
          error = err as IFullError;
        }

        expect(error?.message).toEqual(target.message);
      });

      it('Id is too short', async () => {
        let error: IFullError | undefined = undefined;
        const target = new IncorrectArgLengthError('id', 24, 24);

        const data = structuredClone<Partial<IMarkFavReq & { userId: string }>>(baseDto);
        data.params!.id = '1';

        try {
          const dto = new MarkFavDto(data as IMarkFavReq);
          await markFavoriteArticle(dto);
        } catch (err) {
          error = err as IFullError;
        }

        expect(error?.message).toEqual(target.message);
      });

      it('Id is too long', async () => {
        let error: IFullError | undefined = undefined;
        const target = new IncorrectArgLengthError('id', 24, 24);

        const data = structuredClone<Partial<IMarkFavReq & { userId: string }>>(baseDto);
        data.params!.id = utils.generateRandomName(25);

        try {
          const dto = new MarkFavDto(data as IMarkFavReq);
          await markFavoriteArticle(dto);
        } catch (err) {
          error = err as IFullError;
        }

        expect(error?.message).toEqual(target.message);
      });

      it('Id is not a objectId', async () => {
        let error: IFullError | undefined = undefined;
        const target = new IncorrectArgTypeError('id should be objectId');

        const data = structuredClone<Partial<IMarkFavReq & { userId: string }>>(baseDto);
        data.params!.id = utils.generateRandomName(24);

        try {
          const dto = new MarkFavDto(data as IMarkFavReq);
          await markFavoriteArticle(dto);
        } catch (err) {
          error = err as IFullError;
        }

        expect(error?.message).toEqual(target.message);
      });
    });
  });

  describe('Should pass', () => {
    it('Pass', async () => {
      let error: IFullError | undefined = undefined;

      await FakeGenerator.createUser();
      await FakeGenerator.createArticle();

      try {
        const dto = new MarkFavDto(baseDto);
        await markFavoriteArticle(dto);
      } catch (err) {
        error = err as IFullError;
      }

      expect(error).toBeUndefined();
    });
  });
});

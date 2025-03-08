import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';
import supertest from 'supertest';
import Mongo from '../../../src/connections/mongoose/index.js';
import State from '../../../src/tools/state.js';
import FakeGenerator from '../../utils/fakeData/generator.js';
import fakeData from '../../utils/fakeData/index.json';
import { createAccessToken, createCookie } from '../../utils/index.js';
import { app } from '../../utils/setup.js';
import type { IGetFavArticlesDto } from '../../../src/modules/article/subModules/favorite/get/types.js';
import type { IArticleEntity } from '../../../src/modules/article/types';
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
    // describe('No data passed', () => {
    // });
    // describe('Incorrect data', () => {
    // });
  });

  describe('Should pass', () => {
    it('Pass', async () => {
      await FakeGenerator.createUser();

      const query = new URLSearchParams({
        page: baseDto.page!,
      });

      const req = await supertest(app)
        .get(`/articles/articles/favourites?${query.toString()}`)
        .set('Cookie', createCookie('accessToken', createAccessToken()))
        .send();

      const body = req.body as {
        data: IArticleEntity[];
        currentPage: number;
        totalPages: number;
      };

      expect(body.data).toEqual([]);
      expect(body.currentPage).toEqual(1);
      expect(body.totalPages).toEqual(0);
    });
  });
});

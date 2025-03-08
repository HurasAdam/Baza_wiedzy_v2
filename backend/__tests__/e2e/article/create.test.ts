import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';
import supertest from 'supertest';
import Mongo from '../../../src/connections/mongoose/index.js';
import State from '../../../src/tools/state.js';
import FakeGenerator from '../../utils/fakeData/generator.js';
import fakeData from '../../utils/fakeData/index.json';
import { createAccessToken, createCookie } from '../../utils/index.js';
import { app } from '../../utils/setup.js';
import type { ArticleEntity } from '../../../src/modules/article/entity.js';
import type { ICreateArticleDto } from '../../../src/modules/article/subModules/create/types.js';
import { afterEach } from 'node:test';

describe('Create article', () => {
  const baseDto: ICreateArticleDto = {
    title: 'title',
    employeeDescription: 'E Desc',
    tags: [fakeData.data.tags[0]!.id],
    clientDescription: 'C Desc',
    product: fakeData.data.products[0]!.id,
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
    it('', async () => {
      await FakeGenerator.createUser();

      const req = await supertest(app)
        .post('/articles/create')
        .set('Cookie', createCookie('accessToken', createAccessToken()))
        .send(baseDto);

      const body = req.body as { message: string; data: ArticleEntity };

      expect(body.message).toEqual('Dodano nowy artykuł');
      expect(body.data.title).toEqual(baseDto.title);
      expect(body.data.employeeDescription).toEqual(baseDto.employeeDescription);
      expect(body.data.tags).toEqual(baseDto.tags);
      expect(body.data.clientDescription).toEqual(baseDto.clientDescription);
      expect(body.data.product).toEqual(baseDto.product);
    });
  });
});

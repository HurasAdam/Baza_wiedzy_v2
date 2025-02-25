import type { IOptional } from './generic.js';
import type * as enums from '../enums/index.ts';
import type {
  IArticleEntity,
  IArticleHistoryEntity,
  ICreateArticle,
  ICreateArticleHistory,
} from '../modules/article/types.js';
import type { IAuthEntity, ICreateAuth } from '../modules/auth/types.js';
import type { IConversationRaportEntity, ICreateConversationReport } from '../modules/conversationReport/types.js';
import type { ICreateConversationTopic, IConversationTopicEntity } from '../modules/conversationTopic/types.js';
import type { ICreateNotification, INotificationEntity } from '../modules/notification/types.js';
import type { ICreateProduct, IProductEntity } from '../modules/product/types.js';
import type { ICreateSession, ISessionEntity } from '../modules/session/types.js';
import type { ICreateTag, ITagEntity } from '../modules/tag/types.js';
import type { ICreateUser, IUserEntity } from '../modules/user/types.js';
import type { FilterQuery } from 'mongoose';

export interface IRepositoryAddData {
  [enums.EControllers.Article]: ICreateArticle;
  [enums.EControllers.ArticleHistory]: ICreateArticleHistory;
  [enums.EControllers.ConversationReport]: ICreateConversationReport;
  [enums.EControllers.ConversationTopic]: ICreateConversationTopic;
  [enums.EControllers.Auth]: ICreateAuth;
  [enums.EControllers.Notification]: ICreateNotification;
  [enums.EControllers.User]: ICreateUser;
  [enums.EControllers.Product]: ICreateProduct;
  [enums.EControllers.Session]: ICreateSession;
  [enums.EControllers.Tag]: ICreateTag;
}

export interface IRepositoryGetData {
  [enums.EControllers.Article]: IArticleEntity;
  [enums.EControllers.ArticleHistory]: IArticleHistoryEntity;
  [enums.EControllers.Auth]: IAuthEntity;
  [enums.EControllers.ConversationReport]: IConversationRaportEntity;
  [enums.EControllers.ConversationTopic]: IConversationTopicEntity;
  [enums.EControllers.Notification]: INotificationEntity;
  [enums.EControllers.User]: IUserEntity;
  [enums.EControllers.Product]: IProductEntity;
  [enums.EControllers.Session]: ISessionEntity;
  [enums.EControllers.Tag]: ITagEntity;
}

export interface IRepositoryGetManyData {
  [enums.EControllers.Article]: IArticleEntity[];
  [enums.EControllers.ArticleHistory]: IArticleHistoryEntity[];
  [enums.EControllers.Auth]: IAuthEntity[];
  [enums.EControllers.ConversationReport]: IConversationRaportEntity[];
  [enums.EControllers.ConversationTopic]: IConversationTopicEntity[];
  [enums.EControllers.Notification]: INotificationEntity[];
  [enums.EControllers.User]: IUserEntity[];
  [enums.EControllers.Product]: IProductEntity[];
  [enums.EControllers.Session]: ISessionEntity[];
  [enums.EControllers.Tag]: ITagEntity[];
}

export interface IRepositoryUpdate {
  [enums.EControllers.Article]: Partial<IArticleEntity>;
  [enums.EControllers.ArticleHistory]: Partial<IArticleHistoryEntity>;
  [enums.EControllers.Auth]: Partial<IAuthEntity>;
  [enums.EControllers.ConversationReport]: Partial<IConversationRaportEntity>;
  [enums.EControllers.ConversationTopic]: Partial<IConversationTopicEntity>;
  [enums.EControllers.Notification]: Partial<INotificationEntity>;
  [enums.EControllers.User]: Partial<IUserEntity>;
  [enums.EControllers.Product]: Partial<IProductEntity>;
  [enums.EControllers.Session]: Partial<ISessionEntity>;
  [enums.EControllers.Tag]: Partial<ITagEntity>;
}

export interface IAbstractRepository<Z extends enums.EControllers> {
  add(data: IRepositoryAddData[Z]): Promise<string>;
  getById(_id: string): Promise<IOptional<IRepositoryGetData[Z]>>;
  get(data: FilterQuery<Partial<IRepositoryGetData[Z]>>): Promise<IRepositoryGetManyData[Z]>;
  count(data: FilterQuery<Partial<IRepositoryGetData[Z]>>): Promise<number>;
  update(_id: string, data: Partial<IRepositoryGetData[Z]>): Promise<void>;
  remove(_id: string): Promise<void>;
  removeMany(filter: FilterQuery<Partial<IRepositoryGetData[Z]>>): Promise<void>;
}

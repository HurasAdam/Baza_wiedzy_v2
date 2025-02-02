import { Router } from 'express';
import {
  createTagHandler,
  deleteTagHandler,
  getSingleTagHandler,
  getTagsHandler,
  updateTagHandler,
} from '../../controllers/tag.controller.js';
import preventDeleteDefaultTag from '../server/middleware/preventDeleteDefaultTag.js';

const tagRoutes = Router();

// prefix /tags

tagRoutes.get('/', getTagsHandler);
tagRoutes.get('/tag/:id', getSingleTagHandler);
tagRoutes.post('/create', createTagHandler);
tagRoutes.put('/tag/:id/update', updateTagHandler);
tagRoutes.delete('/tag/:id/delete', preventDeleteDefaultTag, deleteTagHandler);

export default tagRoutes;

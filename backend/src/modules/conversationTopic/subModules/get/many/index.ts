import constructSearchQuery from '../../../../../utils/constructSearchQuery.js';
import ConversationTopicModel from '../../../model.js';
import type { ParsedQs } from 'qs';

export default (baseQuery: ParsedQs): unknown => {
  const query = constructSearchQuery(baseQuery);

  return ConversationTopicModel.find(query)
    .populate([{ path: 'product', select: ['name', 'labelColor', 'banner', '-_id'] }])
    .sort('product.name');
};

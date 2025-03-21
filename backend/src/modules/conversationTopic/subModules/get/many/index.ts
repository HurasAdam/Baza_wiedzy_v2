import constructSearchQuery from '../../../../../utils/constructSearchQuery.js';
import ConversationTopicModel from '../../../model.js';
import type { ParsedQs } from 'qs';

/**
 * Export controller, for endpoint to get many conversation topics.
 * @param baseQuery
 */
const getManyConversationTopics = (baseQuery: ParsedQs): unknown => {
  const query = constructSearchQuery(baseQuery);

  return ConversationTopicModel.find(query)
    .populate([{ path: 'product', select: ['name', 'labelColor', 'banner', '-_id'] }])
    .sort('product.name');
};

export default getManyConversationTopics;

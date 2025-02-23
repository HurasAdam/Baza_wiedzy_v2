# TODO

- Fix error code responses on errors. Tons of them are pointless
- Interfaces for requests ( req ) have mixed interfaces for query and params with body. Make sure to clean them
- GetLatestArticlesDto and possibly more dtos, are getting query params as string and then run "parseInt" on them. This will not work and can possibly break things
- Make sure that dtos include proper validations
- There are some issues with interfaces. Some agreggations do not have proper types
- ConversationTopic - get -> query is not specified and user can type anything. This is bad


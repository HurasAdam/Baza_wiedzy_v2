# TODO

Thos todos might be outdated. Validate each one of them

- Fix error code responses on errors. Tons of them are pointless
- Interfaces for requests ( req ) have mixed interfaces for query and params with body. Make sure to clean them
- GetLatestArticlesDto and possibly more dtos, are getting query params as string and then run "parseInt" on them. This will not work and can possibly break things
- Make sure that dtos include proper validations
- There are some issues with interfaces. Some agreggations do not have proper types
- ConversationTopic - get -> query is not specified and user can type anything. This is bad
- I moved tons of db requests to repos, but some elements are still using models
- Possibly password does not hash on register
- ConversationRepo add might incorrectly return data
- #TODOS
- Repository has incorrect types for update
- Create 404 router with proper response
- Get favorites returns "{ data: [], currentPage: 1, totalPages: 0 }" when there is no data. Should probably return all 0 or all 1


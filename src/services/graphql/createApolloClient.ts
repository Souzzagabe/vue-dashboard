import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client/core'

export function createApolloClient(uri: string) {
  return new ApolloClient({
    link: createHttpLink({ uri }),
    cache: new InMemoryCache(),
    defaultOptions: {
      query: {
        fetchPolicy: 'cache-first',
      },
      watchQuery: {
        fetchPolicy: 'cache-first',
        nextFetchPolicy: 'cache-first',
      },
    },
  })
}

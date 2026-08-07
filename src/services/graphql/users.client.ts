import {
    ApolloClient,
    InMemoryCache,
    createHttpLink
} from '@apollo/client/core'

const httpLink = createHttpLink({
    uri: 'https://graphqlzero.almansi.me/api'
})

export const apolloClient = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
    defaultOptions: {
        query: {
            fetchPolicy: 'cache-first'
        },
        watchQuery: {
            fetchPolicy: 'cache-first',
            nextFetchPolicy: 'cache-first'
        }
    }
})
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client/core'


const httpLink = createHttpLink({
    uri: 'https://countries.trevorblades.com/'
})


export const apolloClient = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache()
})
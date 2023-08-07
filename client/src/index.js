/* eslint-disable no-unused-vars */
import './index.css';
import App from './App';
import React from 'react';
import ReactDOM from 'react-dom/client'
import { createClient } from 'graphql-ws'
import reportWebVitals from './reportWebVitals'
import { BrowserRouter } from 'react-router-dom'
import { setContext } from '@apollo/client/link/context';
import { getMainDefinition } from '@apollo/client/utilities'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { ApolloClient, InMemoryCache, ApolloProvider, split, HttpLink } from '@apollo/client';

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      authorization: localStorage.getItem('jwt') || "",
    }
  }
});

const wsLink = new GraphQLWsLink(createClient({
  url: 'ws://localhost:4000/graphql'
}))

const httpLink = new HttpLink({
  uri: 'http://localhost:4000/graphql',
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' && definition.operation === 'subscription'
    );
  },
  wsLink,
  authLink.concat(httpLink),
);

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();

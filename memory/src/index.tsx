import React from 'react';
import ReactDOM from 'react-dom';
import './index.less';
import App from './App';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client'

const client = new ApolloClient({
  uri: 'xxx',     // graphQL服务器地址
  cache: new InMemoryCache()    // apollo 缓存对象
})

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root')
);

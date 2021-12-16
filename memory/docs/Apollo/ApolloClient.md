# Apollo 与 GraphQL 的使用

GraphQL相比于Restful接口最大的优势之一在于请求方可以控制接口返回的数据，比如说一个接口返回了好几个页面分别需要的数据集合，那么我们可以在每个页面分别请求自己页面需要的数据，即在不同的graphql查询字符串里面定义不同的字段向同一个接口请求数据。

## 1.配置

先新建一个React项目，需要分别安装 @apollo/client 和 graphql 两个包，然后在index.tsx中引入，如下：
```
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client'

const client = new ApolloClient({
  uri: 'xxx',                         // graphQL服务器地址
  cache: new InMemoryCache()          // apollo 缓存对象
})

ReactDOM.render(
  <ApolloProvider client={client}>    // 将client对象传递下去
    <App />
  </ApolloProvider>,
  document.getElementById('root')
);
```
然后就可以在index下的页面中自由的发送graphQL请求了。

## 2.使用

首先，需要熟悉graphQL的语法，query以及mutation语法。Apollo的数据获取与存储都是基于其内部的Hooks钩子来进行的，常用的主要有两种：useQuery和useMutation。

### useQuery

在页面中需要先从`@apollo/client`中引入需要的东西，`gql`以及`useQuery`。`useQuery`接受一个`graphQL`查询的字符串。
```
import {gql, useQuery} from '@apollo/client';
```

+ 1.useQuery普通查询

定义`graphQL`查询语句：
    const GET_DATA = gql`
  query GetExchangeRates {         // GetExchangeRates----接口名
    rates {                        // rates----返回的数据结构  
      currency,
      rate
    }
  }
`  

+ 2.useQuery带参数查询
定义`graphQL`查询语句：
    const GET_DATA = gql`
  query GetExchangeRates($currency: String!) {         // 变量参数名以及类型
    rates(currency: $currency) {
      currency,
      rate
    }
  }
`

+ 3.带`option`的查询
带`option`的查询的graphQL语句与其他的并没有什么区别，主要是在调用useQuery的Hooks钩子时传入`options`。
```
const {data, loading, error, refetch} = useQuery(GET_DATA, {variables: {currency: "USD"}, skip: false, pollInterval: 500})
```
**`option`参数说明**
* variables：条件查询所需要传入的变量参数
* skip：是否跳过本次查询，可接受结果为boolean类型的条件表达式
* pollInterval：进行轮询的时间间隔，可使用useQuery返回的startPolling和stopPolling手动开始和停止轮询

**接收查询到的数据**
```
const {data, loading, error, refetch} = useQuery(GET_DATA);
```
查询返回的结果主要有
* data：查询返回的数据，查询未完成时为undefined，与React的视图层绑定，数据改变时会自动更新React的视图
* loading：查询的状态，用于判断查询是否完成
* error：查询出错时返回的错误信息
* refetch：重新获取查询结果，查询没有参数时直接调用，有参数时需要传入相应的参数，如refetch()或者refetch({currency: "USD"}),refetch的结果仍由首次查询获取到的data接收

+ 4.手动执行查询`useLazyQuery`
useLazyQuery与useQuery的不同之处在于：useLazyQuery不会立即执行查询，而是返回一个可供查询的函数，然后在需要进行查询的地方手动调用这个函数进行查询即可。  
```
const [getData, {data, loading, error, ~~refetch~~}] = useLazyQuery(GET_DATA);

getData({variables: {currency: "USD"}, skip});
```

**注意!!!**
需要注意的是，useQuery查询默认会使用Apollo客户端缓存，如果请求的所有数据在本地都有的话，就会使用Apollo本地缓存的数据，不会再向graphQL服务器发送查询请求。可以手动修改useQuery的查询策略，不使用Apollo缓存。Apollo的缓存策略如下：
```
const {data} = useQuery(GET_DATA, {fetchPolicy: 'xxx'});
```
| cache-first | 默认的缓存策略，首先查询本地缓存，如果在缓存中能找到要请求的数据，则不向graphQL服务器发起请求；否则向graphQL服务器发起查询 |
| cache-only  | 只查询缓存，如果缓存中不存在要请求的数据，会抛出一个错误 |
| cache-and-network | 同时对缓存和graphQL服务器进行查询，如果从服务器查询到的数据与缓存不一致，则更新缓存 |
| network-only | 只查询graphQL服务器，不查询缓存 |
| no-cache | 只查询graphQL服务器，并且查询结果不存储在缓存中 |


### useMutation

首先，引入用到的方法及API：
```
import { gql, useMutation } from '@apollo/client
```
定义graphQL请求字符串：
const UPDATE_DATA = gql`
  mutation updateData ($id: Hash!, $name: String!) {
    data (id: $id, name: $name) {
      id,
      name
    }
  }
`
* 1.在代码中使用
`useMutation`不同于`useQuery`的地方在于，useMutation不会在页面渲染的时候自动请求，它返回一个用于更新请求的方法，修改完的数据，加载和错误状态。不返回refetch方法。
```
const [mutationData, {data, loading, error}] = useMutation();  
*或*
const [mutationData, {data, loading, error}] = useMutation(UPDATE_DATA, {variables: {id: 1, name: 'demo'}});
```
需要注意的是，第二种情况下mutationData的优先级更高，也就是说，调用mutationData请求会覆盖useMutation请求。


### Fragments
fragments可以理解为可复用的graphQL查询字符串，当多个graphQL查询字符串有相同的查询字段时，可以将相同的查询字段提取出来，定义成一个fragment，然后再将fragment嵌入到需要的graphQL查询字符串中去。
*fragments.ts*
```
import {gql} from '@apollo/client'

export const GET_USER_FRAGMENT = gql`
  fragment UserInfo on User {       //  UserInfo 里的字段必须是User类型的子集
    id
    name
    age
    hobbies {
      key
      event
    }
  }
`
```
*index.tsx*
```
import { gql } from '@apollo/client';
import { GET_USER_FRAGMENT } from './fragment.ts';

const GET_USERS = gql`
  ${ GET_USER_FRAGMENT }
  query getUsers($gruopId: HashId!) {
    users(groupId: $gruopId) {
      groupId
      groupName
      user {
        ...UserInfo
      }
    }
  }
  // ${ GET_USER_FRAGMENT }
`
```

## 3. Apollo Client 缓存
Apollo Client会将GraphQL查询的结果根据缓存策略存储到本地的内存缓存中，这样某些情况下就可以直接从缓存里查询数据，而无需向graphql服务器发送请求，达到几乎是即时的响应的效果。

### 缓存方式
Apollo Client在本地是以一张平面表的形式进行存储的，虽然从接口查询到的需要缓存的数据可能是多层的对象嵌套，Apollo Client在进行缓存的时候会对每个对象生成一个id，用来标识该对象，在存储外层对象时将其内层嵌套的对象替换成该对象的*对象名+id*，需要的时候再通过这个id找到对应的对象，层层递归。如下图：  


### 缓存配置
在使用的时候需要在Apollo实例对象内初始化一个InMemoryCache对象，然后通过Apollo实例对象传递下去。
```
import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: 'xxx',
  cache: new InMemoryCache(options)            // options用于自定义缓存行为
})
```
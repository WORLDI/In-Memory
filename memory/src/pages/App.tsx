import {gql, useQuery, useLazyQuery} from '@apollo/client'
import './style/App.less';

const GET_DATA = gql`
  query GetExchangeRates {
    rates(currency: "USD") {
      currency,
      rate
    }
  }
`

function App() {

  const {data, loading, error, refetch} = useQuery(GET_DATA)
  const [getData, {data: a, loading: b, error: c, refetch: d}] = useLazyQuery(GET_DATA);

  return (
    <div className="App">
      {
        !loading && (<p>
        {
          data.rates.map(({currency, rate}: any) => <div key={currency}>
            {currency} : {rate}
          </div>)
        }
      </p>)
      }
    </div>
  );
}

export default App;

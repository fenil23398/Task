import react, {useState, useEffect} from "react";
import axios from "axios";
import ReactSearchBox from "react-search-box";
import './App.css';

const base_url = "http://3.108.225.220:5000";
let timer;
function App() {
  const [headers, setHeaders] = useState({});
  const [searchData, setSearchData] = useState([]);

  useEffect(() => {
    axios.get(`${base_url}/api/user-access-token`).then((res) => {
      console.log('******* token ', res?.data?.token);
      setHeaders(res?.data?.token);
    })
    .catch(err => {
      console.log('Error In fetching headers ', err);
    })
  }, []);

  const fetchSearcDataDebounce = searchString => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      axios({
        url: `${base_url}/api/data?search_string=${searchString}`,
        method: 'get',
        headers: {
            'user-access-token': headers,
            'Content-Type': 'application/json'
        }
     })
     .then(response => {
        setSearchData(response?.data);
     }) 
     .catch(err => {
        console.log('Error in Fetching Search Data ', err);
     });
    }, 1000);
  }

  const formatValues = (event) => {
    return {
      name: event.target.name.value,
      ltp: event.target.ltp.value,
      lcp: event.target.lcp.value,
    }
  }
  const submitForm = (event) => {
    event.preventDefault();
    const requestData = formatValues(event);
    axios({
      url: `${base_url}/api/data`,
      data: {
        ...requestData,
      },
      method: 'post',
      headers: {
          'user-access-token': headers,
          'Content-Type': 'application/json'
      }
   })
   .then(response => {
     alert(response?.data);
      console.log('Response on Submit of Data ', response?.data);
   }) 
   .catch(err => {
      console.log('Error in Submitting Data ', err);
   });
  }

  return (
    <div className="App">
      <form onSubmit={submitForm}>
         <label>
           Name <input name="name" />
         </label>
         <label>
           ltp <input name="ltp" />
         </label>
         <label>
           lcp <input name="lcp" />
         </label>
       <button type="submit">Submit</button>
      </form>
      <br />
      <ReactSearchBox
        placeholder="Placeholder"
        value="Doe"
        data={searchData}
        onChange={searchString => fetchSearcDataDebounce(searchString)}
      />

      <h4>Qury Result </h4>
      {
        searchData.map(data => {
          return (<p> Security is {data[0]}</p>)
        })
      }
    </div>
  );
}

export default App;

import './App.css';
import { useState, useEffect } from "react";
import axios from 'axios';

function App() {
  const [init, setInit] = useState(false)
  const [youtubers, setYoutubers] = useState()

  useEffect(() => {
    if (init === false) {
      console.log('hello')
      axios
        .get(`http://localhost:8000/api/feed/`)
        .then((res) => { setYoutubers(res.data.results); console.log(res.data.results); })
        .then(() => setInit(true))
    }
    else {
      console.log("youtubers", youtubers)
    }
  }, [init])

  return (
    <div>
    { init ?
    (

    <div className="App">
      <h1 className="mb-5">MyTube</h1>
      <div className="offset-1 col-10">
        <div className="row">

        {youtubers.map(e => (
          <div className="row mt-2 mb-2">
            <div className="col-2"><a href={`${e.channel}`}>{e.name}</a></div>
            <div className="col-3">
              <img 
                src={`https://img.youtube.com/vi/${e.id}/mqdefault.jpg`} 
                width="300px"
                height="190px"
              />
            </div>
            <div className="col-4">
              <a href={`${e.url}`}>
                {e.title}
              </a>
            </div>
            <div className="col-2">
            </div>
          </div>
        ))}
        </div>
      </div>
    </div>

    ) : ""
    }
    </div>
  );
}

export default App;

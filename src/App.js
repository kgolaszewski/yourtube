import './App.css';
import { useState, useEffect } from "react";
import axios from 'axios';

const img_folder = process.env.PUBLIC_URL 

function App() {
  const [init, setInit] = useState(false)
  const [youtubers, setYoutubers] = useState()
  const [category, setCategory] = useState("miatime")

  useEffect(() => {
    if (init === false) {
      console.log('hello')
      axios
        .get(`http://localhost:8000/api/feed/miatime`)
        .then((res) => { setYoutubers(res.data); console.log("axios", res.data); })
        .then(() => setInit(true))
    }
    else {
      console.log("youtubers", youtubers)
    }
  }, [init])

  useEffect(() => {
    axios
        .get(`http://localhost:8000/api/feed/${category}`)
        .then((res) => { setYoutubers(res.data); console.log("axios", res.data); })
  }, [category])

  return (
    <div>
    { init ?
    (

    <div className="App">
      <h1>
        <img 
          width="200px"
          src={`${img_folder}/favicon2.ico`} 
        />
        MiiTube
      </h1>
      <hr className="mb-5" />
      <div className="offset-1 col-10 buttonrow">
        <button 
          className="btn btn-primary"
          onClick={() => setCategory("")}
        >
          All
        </button>
        <button 
          className="btn btn-info"
          onClick={() => setCategory("miatime")}
        >
          Miatime
        </button>
      </div>
      <div className="offset-1 col-10 pb-5">
        {/* <div className="row"> */}

        {youtubers.map(e => (
          <div className="row mt-2 mb-4">

            <div className="col-2">
              <a className="channelname" href={`${e.channel}`}>{e.name}</a><br />
              < a href={`${e.channel}`}>
              <img 
                src={`${img_folder}/profiles/${e.imagename}.jpg`} 
                width="80px" height="80px"
                className="mt-1 thumbnail"
              />
              </a>
            </div>

            <div className="col-4">
            <a href={`${e.url}`} className="videothumbnail">
              <img 
                src={`https://img.youtube.com/vi/${e.id}/mqdefault.jpg`} 
                width="250px"
                style={{border: "1px #010101 solid", borderRadius: "5px"}}
              />
              <div className="videoduration">
                {e.length}
              </div>
            </a>
            </div>

            <div className="col-6 mt-4 leftalign">
              <a href={`${e.url}`} className="videotitle">
                {e.title}
              </a>
              <br />
              <div className="videodate">
                ({e.date})
              </div>
              <br />
            </div>

          </div>
        ))}
        </div>
      </div>
    // </div>

    ) : ""
    }
    </div>
  );
}

export default App;

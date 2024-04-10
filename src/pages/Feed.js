import BACKEND_URL from '../utils/config'
import '../css/App.css';
import { useState, useEffect, useContext } from "react";
import axios from 'axios';

import AuthContext from '../utils/AuthContext'

const img_folder = process.env.PUBLIC_URL 

function TagFilter(props) {
  let buttontext = props.text ? props.text : props.tag[0].toUpperCase()+props.tag.slice(1)
  return (
    <button 
          className="btn btn-dark btn-tag"
          onClick={() => props.setCategory(props.tag)}
        >
          {buttontext}
        </button>
  )
}

function Home() {
  let { authTokens } = useContext(AuthContext)

  useEffect(() => {
    console.log(BACKEND_URL)
  }, [])
  const [init, setInit] = useState(false)
  const [youtubers, setYoutubers] = useState()
  const [category, setCategory] = useState("miatime")

  useEffect(() => {
    if (init === false) {
      axios
        .get(`${BACKEND_URL}/api/feed/${category}`)
        .then((res) => { setYoutubers(res.data); console.log("axios", res.data); })
        .then(() => setInit(true))
    }
    else {
      console.log("youtubers", youtubers)
    }
  }, [init])

  useEffect(() => {
    axios
        .get(`${BACKEND_URL}/api/feed/${category}`)
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
        WeTube
      </h1>
      <hr className="mb-5" />
      <div className="offset-1 col-10 buttonrow mb-5">
        <TagFilter tag="" text={"All"}  setCategory={setCategory} />
        <TagFilter tag="miatime" setCategory={setCategory} />
        <TagFilter tag="essay" setCategory={setCategory} />
        <TagFilter tag="gaming" setCategory={setCategory} />
        <TagFilter tag="ssbm" text="SSBM" setCategory={setCategory} />
        <TagFilter tag="chess" setCategory={setCategory} />
      </div>
      <div className="offset-1 col-10 pb-5">
        {/* <div className="row"> */}

        {youtubers.map((e, i) => (
          <div className="row mt-2 mb-4" key={`youtuber-${i}`}>

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

export default Home;

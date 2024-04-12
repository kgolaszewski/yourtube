import BACKEND_URL from '../utils/config'
import '../css/App.css';
import { useState, useEffect, useContext } from "react";
import useAxios from '../utils/useAxios'

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
  const api = useAxios()

  let { authTokens } = useContext(AuthContext)

  const [init, setInit] = useState(false)
  const [youtubers, setYoutubers] = useState()
  const [category, setCategory] = useState("")

  useEffect(() => {
    if (init === false) {
      api
        .get(`${BACKEND_URL}/api/feed/${category}`)
        .then((res) => { setYoutubers(res.data) })
        .then(() => setInit(true))
    }
  }, [init])

  useEffect(() => {
    api
        .get(`${BACKEND_URL}/api/feed/${category}`)
        .then((res) => { setYoutubers(res.data) })
  }, [category])

  return (
    <div>
    { init && (
      <div className="App">
        <h1>
          <img id="sitelogo" width="200px" src={`${img_folder}/favicon2.ico`} />
          WeTube
        </h1>
        <hr className="mb-5" />
        <div className="offset-1 col-10 buttonrow mb-5">
          <TagFilter tag="" text={"All"}  setCategory={setCategory} />
        </div>
        <div className="offset-1 col-10 pb-5">
          {youtubers.map((e, i) => (
            <div className="row mt-2 mb-4" key={`youtuber-${i}`}>

              <div className="col-2">
                <a className="channelname" href={`${e.channel}`}>{e.name}</a><br />
                <a href={`${e.channel}`}>
                <img 
                  src={`${img_folder}/profiles/${e.imagename}.jpg`} 
                  className="mt-1 thumbnail"
                  width="80px" height="80px"
                />
                </a>
              </div>

              <div className="col-4">
              <a href={`${e.url}`} className="videothumbnail">
                <img  src={`https://img.youtube.com/vi/${e.id}/mqdefault.jpg`}  />
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
              </div>

            </div>
          ))}
          </div>
        </div>
      )
    }
    </div>
  );
}

export default Home;

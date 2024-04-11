import BACKEND_URL from '../utils/config'
import '../css/App.css';
import { useState, useEffect, useContext } from "react";
import useAxios from '../utils/useAxios'

import AuthContext from '../utils/AuthContext'

const img_folder = process.env.PUBLIC_URL 

function Subscribe() {

  const api = useAxios()

  let { authTokens } = useContext(AuthContext)

  const [youtubers, setYoutubers] = useState([])
  const [subscribed, setSubscribed] = useState([])

  const handleSubscribe = (e) => {
    api
      .post(
        `${BACKEND_URL}/api/subscribe/`, 
        { youtuber: e.target.value, },
      )
      .then(res => { setSubscribed([...subscribed, e.target.value]) })
      .catch(err => console.log(err))
  }

  const handleUnsubscribe = (e) => {
    api
      .delete(
        `${BACKEND_URL}/api/subscribe/`, 
        { data: {youtuber: e.target.value}, },
      )
      .then(res => {
        setSubscribed([...subscribed.filter( elem => elem !== e.target.value)])
      })
      .catch(err => console.log(err))
  }

  useEffect(() => {
    api
      .get(`${BACKEND_URL}/api/youtubers`)
      .then((res) => { setYoutubers([...res.data.results]) } )

    api
      .get(`${BACKEND_URL}/api/subscribe/`)
      .then(res => {
        setSubscribed(res.data.subscriptions)
      })
  }, [])

  return (
    <div className="App">
      <div className="offset-1 col-10 pb-5">
        <h1>YouTubers</h1>

        {
          youtubers.length > 0 && (
            <div>
           {
            youtubers.map((youtuber, i) => (
              <div key={`key-${i}`} className="offset-4 col-4 row mb-3 subscribe-row">
                  <img className="profile-picture" src={`${img_folder}/profiles/${youtuber.username}.jpg`} />
                  <div>{youtuber.display_name}</div>
                  {
                    !subscribed.includes(youtuber.username) ? 
                    (
                      <button 
                        className="btn btn-light btn-subscribe" 
                        value={youtuber.username}
                        onClick={(e) => handleSubscribe(e)}
                      >
                        Subscribe
                      </button>
                    ) 
                      :
                    (
                      <button 
                        className="btn btn-danger btn-subscribe" 
                        value={youtuber.username}
                        onClick={(e) => handleUnsubscribe(e)}
                      >
                        Unsubscribe
                      </button>
                    )
                  }
              </div>
            ))
           } 
           </div>
          )
        }

      </div>
    </div>
  )
}

export default Subscribe;

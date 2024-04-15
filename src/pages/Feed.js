import '../css/App.css';
import BACKEND_URL from '../utils/config'
import useAxios from '../utils/useAxios'
import AuthContext from '../utils/AuthContext'
import CustomModal from '../components/Modal'

import { useState, useEffect, useContext } from "react";
import { Collapse, } from 'reactstrap'

const img_folder = process.env.PUBLIC_URL 

function TagFilter(props) {
  const buttonType = {
    "":        "btn-outline-light",
    "create":  "btn-outline-light",
    "delete":  "btn-outline-danger",
    "edit":    "btn-outline-warning",
    "special": "btn-primary"
  }
  return (
    <button 
          className={`
            btn btn-tag 
            ${
              (props.mode === ""  && props.special) ? 
              buttonType[props.special] : buttonType[props.mode]
            }
          `}
          onClick={() => { 
            if (props.mode === "delete") { 
              props.handleTagClick(props.category_id) 
            }
            else if (props.mode === "edit") {
              props.handleTagClick(props.category)
            }
            else {
              props.handleTagClick(props.tag)
            }
          }}
        >
          {props.text}
        </button>
  )
}

function Home() {
  const api = useAxios()

  let { user } = useContext(AuthContext)

  const [init, setInit] = useState(false)

  const [youtubers, setYoutubers] = useState()
  const [feeds, setFeeds] = useState()
  const [categories, setCategories] = useState()

  const [feed, setFeed] = useState()
  const [activeCategory, setActiveCategory] = useState("")

  const [newCategory, setNewCategory] = useState("")
  const [selectedCategory, setSelectedCategory] = useState({tag: ""})

  const [mode, setMode] = useState("")

  const [isNewOpen,  setIsNewOpen]  = useState(false) 
  const [isEditOpen, setIsEditOpen] = useState(false) 

  const [modal, setModal] = useState(false)
  const toggle = () => setModal(!modal)

  const [selectedYoutuber, setSelectedYoutuber] = useState("")
  const [options, setOptions] = useState([])

  useEffect(async () => {
    if (init === false) {
      await api
        .get(`${BACKEND_URL}/api/feed/`)
        .then((res) => { 
          setYoutubers(res.data)
        })
      
      api
        .get(`${BACKEND_URL}/api/profile/`)
        .then((res) => { 
          setFeeds(res.data.feeds)
          setCategories(res.data.categories)
        })
        .then(() => setInit(true))
    }
  }, [init])

  useEffect(() => {
    if (init && youtubers) {
      if (activeCategory !== "") {
        setFeed( [...youtubers.filter(youtuber => Object.keys(feeds[activeCategory]).includes(youtuber.imagename))] )
      }
      else {
        setFeed([...youtubers])
      }
    }
  }, [youtubers, init, activeCategory])

  const handleTagSubmit = (tag) => {
    if (tag) {
      api
        .post(
          `${BACKEND_URL}/api/categories/`,
          { tag: tag, user: user.user_id, }
        )
        .then(res => {
          setCategories([...categories, res.data])
          setNewCategory("")
          setIsNewOpen(false)
          setMode("")
          setFeeds({
            ...feeds,
            [tag]: {},
          })
        })
    }
  }

  const handleTagDelete = (id) => {
    api
      .delete(
        `${BACKEND_URL}/api/categories/${id}/`
      )
      .then(res => {
        setCategories( categories.filter(category => category.id !== id) )}
      )
  }

  const handleTagEdit = (category) => {
    api
      .put(
        `${BACKEND_URL}/api/categories/${category.id}/`,
        category
      )
      .then(res => {
        setCategories([
          ...categories.filter(e => e.id !== category.id),
          category
        ].toSorted((a,b) => a.id-b.id))
        setIsEditOpen(false)
        setMode("")
        setSelectedCategory({tag: ""})
      })

  }

  const handleEditing = (category) => {
    if (isEditOpen) {
      if (category === selectedCategory) { 
        setSelectedCategory({tag: ""})
        setIsEditOpen(false) 
      }
      else {
        setSelectedCategory(category)
      }
    }
    else {
      setIsEditOpen(true)
      setSelectedCategory(category)
    }
  }

  const onClickMethod = {
    "": setActiveCategory,
    "delete": handleTagDelete,
    "edit": handleEditing,
  }

  const handleTaggingYoutuber = (data, setFeedsMethod=setFeeds) => {
    api
      .post(
        `${BACKEND_URL}/api/tags/`,
        {
          category: data.category.id,
          youtuber: data.youtuber,
        }
      )
      .then(res => {
        setFeedsMethod({
          ...feeds,
          [data.category.tag]: {
            ...feeds[data.category.tag],
            [res.data.youtuber]: res.data.id
          }
        })
        console.log(res.data, {
          ...feeds,
          [data.category.tag]: {
            ...feeds[data.category.tag],
            [res.data.youtuber]: res.data.id
          }
        })
      })
  }
  
  const handleUntag = (id, youtuber, category) => {
    api
      .delete(
        `${BACKEND_URL}/api/tags/${id}/`
      )
      .then(res => {
        // this disaster/code is a non-mutating alternative to: 
        // `delete feeds[category][youtuber]`
        setFeeds({
          ...feeds,
          [category]: Object.keys(feeds[category])
            .filter(e => e !== youtuber)
            .reduce((tot, key) => { 
              tot[key] = feeds[category][key]; 
              return tot; 
            }, {})
        })
        setFeed([...feed.filter(e => e.imagename !== youtuber)])
      })
  }

  return (
    <div>
    { init && feed && (
      <div className="App">
        <h1>
          <img id="sitelogo" width="200px" src={`${img_folder}/favicon2.ico`} />
          YourTube
        </h1>
        <hr className="mb-5" />
        <div className="offset-1 col-10 buttonrow mb-5">
          <TagFilter 
            tag="" key="" text="All" mode="" handleTagClick={setActiveCategory} 
            special={activeCategory === "" ? "special" : ""}
          />
          {
            categories.map(elem => (
              <TagFilter 
                key={elem.id} 
                tag={elem.tag} 
                text={elem.tag}
                mode={mode}
                category_id={elem.id}
                category={elem}
                handleTagClick={onClickMethod[mode]}
                special={activeCategory === elem.tag ? "special" : ""}
              />
            ))
          }
          <button
            className={`btn ms-3 ${mode === "create" ? "btn-success" : "btn-outline-success" }`}
            onClick={() => {
              setMode(mode === "create" ? "" : "create")
              setIsNewOpen(!isNewOpen)
              setIsEditOpen(false)
            }}
          >
            +
          </button>
          <button
            className={`btn ms-3 ${mode === "delete" ? "btn-danger" : "btn-outline-danger" }`}
            onClick={() => {
              setMode(mode === "delete" ? "" : "delete")
              setIsNewOpen(false)
              setIsEditOpen(false)
              setNewCategory("")
            }}
          >
            X
          </button>
          <button
            className={`btn ms-3 ${mode === "edit" ? "btn-warning" : "btn-outline-warning" }`}
            onClick={() => {
              setMode(mode === "edit" ? "" : "edit")
              setIsNewOpen(false)
              setIsEditOpen(false)
              setNewCategory("")
            }}
          >
            ?
          </button>
        </div>

        <Collapse isOpen={isNewOpen}>
          <form>
            <input
              id="newCategory" 
              name="newCategory" value={newCategory} 
              type="text" 
              placeholder="New tag name"
              onChange={ (e) => setNewCategory(e.target.value) } 
            />
            <button 
              className="btn-primary"
              type="submit"
              onClick={(e) => { 
                e.preventDefault()
                handleTagSubmit(newCategory) 
              }}
            > 
              + 
            </button>
          </form>
        </Collapse>

        <Collapse isOpen={isEditOpen}>
          <form>
          <input
            id="newCategory" 
            name="newCategory" 
            type="text" 
            value={selectedCategory.tag} 
            onChange={ (e) => setSelectedCategory({...selectedCategory, "tag": e.target.value}) } 
          />
          <button 
            className="btn-primary"
            type="submit"
            onClick={(e) => { 
              e.preventDefault()
              handleTagEdit(selectedCategory) 
            }}
          > 
            + 
          </button>
          </form>
        </Collapse>

        <div className="offset-1 col-10 pb-5">
          {feed.map((e, i) => (
            <div className="row mt-2 mb-4" key={`youtuber-${i}`}>

              <div style={{
                maxWidth: "50px", 
                display: "flex", 
                alignItems: "center",
              }}>
              {  
                activeCategory === "" ?
                (
                  <button 
                    className="btn btn-outline-secondary btn-sm add-tag"
                    onClick={() => {
                      toggle();
                      setSelectedYoutuber(e.imagename)
                      setOptions([...categories.filter(category => !Object.keys(feeds[category.tag]).includes(e.imagename))])
                    }}
                  >
                    +
                  </button>
                ) : 
                (
                  <button 
                    className="btn btn-outline-secondary btn-sm add-tag"
                    onClick={() => {
                      handleUntag(
                        feeds[activeCategory][e.imagename],
                        e.imagename,
                        activeCategory
                      )
                      // setSelectedYoutuber(e.imagename)
                      // setOptions([...categories.filter(category => !feeds[category.tag].includes(e.imagename))])
                    }}
                  >
                    X
                  </button>
                )
              }
              </div>

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

              <div className="col-5 mt-4 leftalign">
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
    {
      modal && (
        <CustomModal
          toggle={toggle}
          modal={`${modal}`}
          youtuber={selectedYoutuber}
          feeds={feeds}
          options={options}
          submitmethod={handleTaggingYoutuber}
          setFeeds={setFeeds}
        />
      )
    }
    </div>
  );
}

export default Home;

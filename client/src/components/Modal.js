import React, { useState } from 'react'
import { useCookies } from 'react-cookie'

const Modal = ({ mode, setShowModal, task, getData}) => {
  const [cookies, setCookie, removeCookie] = useCookies(null)
  const editMode = mode === "edit" ? true : false

  const [data, setData] = useState({
      user_email: editMode ? task.user_email : cookies.Email, 
      title: editMode ? task.title : null,
      progress: editMode ? task.progress : 50, 
      date: editMode ? task.date : new Date()
  })

  const postData = async (e) => { 
    e.preventDefault()
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVERURL}/todos`, {
        method: "POST", 
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify(data)
      })
      if (response.status === 200) {
        console.log('WORKED')
        setShowModal(false)
        getData()
      }
    } catch(err) { 
      console.error(err)
    }
  }

  const editData = async(e) => {
    e.preventDefault()
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVERURL}/todos/${task.id}`, { 
        method: "PUT", 
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify(data)
      })
      if (response.status === 200) {
        setShowModal(false)
        getData()
      }
    } catch (err) {
      console.error(err)
    }
  }


  const handleChange = (e) => {
    console.log("changing", e)
    const {name, value} = e.target 

    setData(data => ({
      ...data, 
      [name] : value
    }))

    console.log(data)

  }

  return (
    <div className="modal-overall">
      <div className="modal">
        <div className="form-container">
          <h3>Let's {mode} your task </h3>
          <button onClick={() => setShowModal(false)}>
          <svg className="tick-check" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512">
            <path d="M376.6 84.5c11.3-13.6 9.5-33.8-4.1-45.1s-33.8-9.5-45.1 4.1L192 206 56.6 43.5C45.3 29.9 25.1 28.1 11.5 39.4S-3.9 70.9 7.4 84.5L150.3 256 7.4 427.5c-11.3 13.6-9.5 33.8 4.1 45.1s33.8 9.5 45.1-4.1L192 306 327.4 468.5c11.3 13.6 31.5 15.4 45.1 4.1s15.4-31.5 4.1-45.1L233.7 256 376.6 84.5z"/>
          </svg>
          
          </button>
        </div>

        <form>
          <input 
          required
          maxLength={30}
          placeholder=' Define Your Task Here' 
          name="title"
          value={data.title}
          onChange={handleChange}
          />
          <br />

          <label for="range">Slide to select your current progress</label>
          <input 
          type="range"
          id="range"
          required
          min="0"
          max="100"
          name="progress"
          value={data.progress}
          onChange={handleChange}
          />
          <input 
          className={mode} 
          type="submit"
          onClick={editMode ? editData: postData}/>
        </form>
      </div>
    </div>
  )
}

export default Modal; 
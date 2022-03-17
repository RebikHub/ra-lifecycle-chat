import React, { useState, useEffect, useRef } from "react";
import Message from "./components/Message";
import MessageSend from "./components/MessageSend";
import randomColor from "randomcolor";
import { nanoid } from "nanoid";

export default function App() {
  const [user, setUser] = useState({
    color: randomColor(),
    id: nanoid(),
  })

  function newUser() {
    const localUser = JSON.parse(localStorage.getItem('user'))
    setUser({
      color: localUser.color,
      id: localUser.id
    })
  }

  useEffect(() => {
    if (!localStorage.getItem('user')) {
      localStorage.setItem('user', JSON.stringify(user))
    } else {
      newUser()
    }
  }, [])
  
  const [messages, setMessages] = useState([])
  const [message, setMessage] = useState('')
  const [lastId, setLastId] = useState(0)
  const chatRef = useRef(null)

  function scrollBottom() {
    chatRef.current.scrollIntoView({block: "start"})
  }

  async function fetchGet(id) {
    const url = `https://react-note-back.herokuapp.com/messages?from=${id}`
    const response = await fetch(url)
    const data = await response.json()
    if (data.length !== 0 && data[0].id > lastId) {
      setLastId(data[data.length-1].id)
      setMessages((prev) => ([...prev, ...data]))
    }
  }

  async function fetchPost(data) {
    const url = 'https://react-note-back.herokuapp.com/messages/'
    await fetch(url, {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }
  async function loadData(id) {
    await fetchGet(id)
    console.log("load");
  }
  function handleText(ev) {
    setMessage(ev.target.value)
  }
  function handleSend() {
    fetchPost({
      color: user.color,
      id: user.id,
      text: message
    })
    fetchGet(lastId)
    setMessage('')
  }

  useEffect(() => {
    scrollBottom()
  }, [lastId]);

  useEffect(() => {
    loadData(lastId)
  }, []);

  useEffect(() => {
    let timeout = setInterval(() => loadData(lastId), 1000)
    return () => {
      clearInterval(timeout)
    };
  });
console.log(messages);
  return (
    <div className="chat">
      <h3 className="chat-title">Anonymous Chat</h3>
      <div className="chat-room" >
        <div style={{marginTop: 'auto'}}></div>
        {messages.map((el) =>
          <Message
            text={el.data.text}
            color={el.data.color === user.color ? user.color : el.data.color}
            whoSend={el.data.id === user.id ? 'right' : ''}
            key={el.id}/>
        )}
        <div ref={chatRef} style={{marginTop: '40px'}}></div>
      </div>
      <MessageSend
        text={message}
        handleText={handleText}
        handleSend={handleSend}/>
    </div>
  );
}

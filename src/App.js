import React, { useState, useEffect, useRef } from "react";
import Message from "./components/Message";
import MessageSend from "./components/MessageSend";
import randomColor from "randomcolor";
import { nanoid } from "nanoid";

export default function App() {
const [messages, setMessages] = useState([])
const [message, setMessage] = useState('')
const [lastId, setLastId] = useState(0)
let timeout
const chatRef = useRef(null)
function scrollBottom() {
  chatRef.current.scrollIntoView()
}
  async function fetchGet(id) {
    const url = `http://localhost:7777/messages?from=${id}`
    const response = await fetch(url)
    const data = await response.json()
    setMessages(data)
    // setLastId(data[data.length-1].id)
  }
  async function fetchPost(data) {
    const url = 'http://localhost:7777/messages/'
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(data)
    })
    const id = await response.json()
    console.log(id);
  }
  async function loadData(id) {
    await fetchGet(id)
  }
  function handleText(ev) {
    setMessage(ev.target.value)
  }
  function handleSend() {
    fetchPost({
      color: randomColor(),
      id: nanoid(),
      text: message
    })
    // setLastId(messages[messages.length-1].id)
    setMessage('')
  }

  useEffect(() => {
    scrollBottom()
  }, [messages]);

  useEffect(() => {
    loadData(lastId)
    console.log('mount');
    console.log(messages);
  }, []);

  useEffect(() => {
    timeout = setTimeout(() => loadData(lastId), 1000)
    console.log('update');
    console.log(messages);
    return () => {
      clearTimeout(timeout)
    };
  }, [messages]);

  return (
    <div className="chat">
      <h3 className="chat-title">Anonymous Chat</h3>
      <div className="chat-room" >
        {messages.map((el) =>
          <Message
            text={el.data.text}
            id={el.data.id}
            whoSend={el.data.color}
            key={el.id}/>
        )}
        <div ref={chatRef}></div>
      </div>
      <MessageSend
        text={message}
        handleText={handleText}
        handleSend={handleSend}/>
    </div>
  );
}

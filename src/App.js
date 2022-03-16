import React, { useState, useEffect } from "react";
import Message from "./components/Message";
import MessageSend from "./components/MessageSend";
import randomColor from "randomcolor";
import { nanoid } from "nanoid";

export default function App() {
  const [messages, setMessages] = useState([])
const [message, setMessage] = useState('')
const [lastId, setLastId] = useState(0)
let timeout
  async function fetchGet(id) {
    const url = `http://localhost:7777/messages?from=${id}`
    const response = await fetch(url)
    const data = await response.json()
    console.log(data);
    setMessages(data)
    setLastId(data.length !== 0 ? data[data.length - 1].id : 0)
  }
  async function fetchPost(data) {
    const url = 'http://localhost:7777/messages/'
    await fetch(url, {
      method: 'POST',
      body: JSON.stringify(data)
    })
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
    setMessage('')
  }
  useEffect(() => {
    loadData(lastId)
  }, []);

  // useEffect(() => {
  //   timeout = setTimeout(() => loadData(lastId), 1000)
  //   return () => {
  //     clearTimeout(timeout)
  //   };
  // }, [lastId]);
  console.log(messages);
  return (
    <div className="chat">
      <h3 className="chat-title">Anonymous Chat</h3>
      <div className="chat-room">
        {messages.map((el) =>
          <Message text={el.data.text} id={el.data.id} whoSend={el.data.color} key={el.id}/>
        )}
      </div>
      <MessageSend text={message} handleText={handleText} handleSend={handleSend}/>
    </div>
  );
}

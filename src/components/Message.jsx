import React from 'react'

export default function Message({text, id, whoSend}) {
  return (
    <div className={`message ${whoSend}`} style={{backgroundColor: whoSend}} data-id={id}>{text}</div>
  )
}

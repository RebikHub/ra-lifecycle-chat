import React from 'react'

export default function Message({text, color, whoSend}) {
  return (
    <div className={`message ${whoSend}`} style={{backgroundColor: color}}>
      {text}
    </div>
  )
}

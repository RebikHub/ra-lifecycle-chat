import React from 'react';

export default function MessageSend({text, handleText, handleSend}) {
  return (
    <form className="chat-form">
      <input type="text" className="chat-input"
        value={text}
        onChange={handleText}
        onKeyPress={(ev) => {
          if (ev.key === "Enter") {
            ev.preventDefault();
            handleSend();
          }
        }}
        />
      <button type="button" className="send-btn" onClick={handleSend}></button>
    </form>
  );
}

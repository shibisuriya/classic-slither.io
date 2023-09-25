import React, { useEffect, useState } from "react";

function App() {
  const [message, setMessage] = useState("");
  const [peerConnection, setPeerConnection] = useState(null);

  const handleInputChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSendMessage = () => {
    if (peerConnection && message.trim() !== "") {
      sendMessage(message);
    }
  };

  const sendMessage = (message) => {
    const dataChannel = peerConnection.createDataChannel("dataChannel");
    dataChannel.onopen = () => {
      dataChannel.send(message);
    };
  };

  useEffect(() => {
    const config = {
      iceServers: [
        {
          urls: "stun:stun4.l.google.com:19302", // Public STUN server
        },
        {
          url: "turn:192.158.29.39:3478?transport=udp",
          credential: "JZEOEt2V3Qb0y27GRntt2u2PAYA=",
          username: "28224511:1379330808",
        },
      ],
    };

    const peerConn = new RTCPeerConnection(config);

    peerConn.ondatachannel = (event) => {
      event.channel.onmessage = (e) => {
        setMessage(e.data);
      };
    };

    setPeerConnection(peerConn);
  }, []);

  return (
    <div className="App">
      <h1>WebRTC Chat</h1>
      <div className="message-box">
        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={handleInputChange}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
      <div className="chat-box">
        <h2>Received Message:</h2>
        <div className="received-message">{message}</div>
      </div>
    </div>
  );
}

export default App;

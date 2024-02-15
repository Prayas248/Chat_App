import React, { useState} from "react";
import { Chat } from "./pages/chater";
import { Auth } from "./pages/Auth";
import { AppWrapper } from "./pages/Appwrapper";
import Cookies from "universal-cookie";
import "./App.css";


const cookies = new Cookies();

function ChatApp() {
  const [isAuth, setIsAuth] = useState(cookies.get("auth-token"));
  const [isInChat, setIsInChat] = useState(null);
  const [room, setRoom] = useState("");

  if (!isAuth) {
    return (
      <AppWrapper
        isAuth={isAuth}
        setIsAuth={setIsAuth}
        setIsInChat={setIsInChat}
      >
        <Auth setIsAuth={setIsAuth} />
      </AppWrapper>
    );
  }

  return (
    <AppWrapper isAuth={isAuth} setIsAuth={setIsAuth} setIsInChat={setIsInChat}>
      {!isInChat ? (
        <div className="room">
          <label id="typeroom"> Type room name: </label>
          <input onChange={(e) => setRoom(e.target.value)} id="enter-input"/>
          <button
            onClick={() => {
              setIsInChat(true);
            }}
            id="enter-chat"
          >
            Enter Chat
          </button>
        </div>
      ) : (
        <Chat room={room} />
      )}
    </AppWrapper>
  );
}

export default ChatApp;
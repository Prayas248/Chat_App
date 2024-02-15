import React, { useState, useEffect, useRef } from "react";
import { db, auth } from "../firebase-config";
import { storage } from "../firebase-config";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";
import "./chater.css";


import {
  collection,
  addDoc,
  where,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";

export const Chat = ({ room }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [imageUpload, setImageUpload] = useState(null);
  

  const user = auth.currentUser;

  const messagesRef = collection(db, 'messages');
  const fileInputRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const [isImageClicked, setIsImageClicked] = useState(false);
  const [newImageDimensions, setNewImageDimensions] = useState({
    width: 'auto',
    height: '100px',
  });
  const [isMobileScreen, setIsMobileScreen] = useState(false);

  const handleResize = () => {
    setIsMobileScreen(window.innerWidth < 480);
  };
  

  useEffect(() => {
    handleResize(); 
    window.addEventListener('resize', handleResize); 
    return () => {
      window.removeEventListener('resize', handleResize); 
    };
  }, []);

  useEffect(() => {
    const queryMessages = query(
      messagesRef,
      where('room', '==', room),
      orderBy('createdAt')
    );
    const unsubscribe = onSnapshot(queryMessages, (snapshot) => {
      let messages = [];
      snapshot.forEach((doc) => {
        messages.push({ ...doc.data(), id: doc.id });
      });
      setMessages(messages);
      scrollToBottom();
    });

    return unsubscribe;
  }, [room]);


  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!imageUpload && !newMessage) return;
    if (imageUpload && newMessage) {
      alert("Please Send Either a file or a message at a time only");
      return;
    }

    if (imageUpload) {
      setNewMessage('');
      const imageRef = ref(storage, `images/${imageUpload.name + v4()}`);
      await uploadBytes(imageRef, imageUpload);
      const downloadURL = await getDownloadURL(imageRef);

      await addDoc(messagesRef, {
        text: '',
        createdAt: serverTimestamp(),
        user: auth.currentUser.displayName,
        room,
        img: downloadURL,
      });

      if (fileInputRef.current) {
        fileInputRef.current.value = null;
      }
    } else {
      setImageUpload(null);
      await addDoc(messagesRef, {
        text: newMessage,
        createdAt: serverTimestamp(),
        user: auth.currentUser.displayName,
        room,
        img: '',
      });
    }
    scrollToBottom();
    setImageUpload(null);
    setNewMessage('');
  };

  return (
    <div className="chat-app">
      <div className="header">
        <h1>{room}</h1>
      </div>
      <div className="messages" ref={messagesContainerRef}>
        {messages.map((message) => (
          <div key={message.id} className="message">
            <div
              className={message.user === user.displayName ? 'sender-user' : 'sender-other'}>
              <span className="user">{message.user === user.displayName ? '' : `${message.user}:`}</span>
              {message.img ? (
                <span className="insider">
                  <img
                    src={message.img}
                    style={
                      isImageClicked
                        ? newImageDimensions
                        : isMobileScreen
                          ? { width: '180px', height: 'auto' }
                          : { width: 'auto', height: '100px' }
                    }
                    alt="User's Image"
                    onClick={() => {
                      setIsImageClicked(!isImageClicked);
                      setNewImageDimensions({
                        width: isMobileScreen ? '180px' : 'auto',
                        height: isMobileScreen ? 'auto' : '200px',
                      });
                    }}
                  />

                </span>
              ) : (
                <span className="insider">
                  {message.text}</span>
              )}
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="new-message-form">
        <input
          type="text"
          value={newMessage}
          onChange={(event) => setNewMessage(event.target.value)}
          className="new-message-input"
          placeholder="Type your message here..."
        />
        <button type="submit" className="send-button">
          <span class="material-symbols-outlined">
            send
          </span>
        </button>
        <label htmlFor="fileInput" className="custom-file-upload" >
          <span class="material-symbols-outlined">
            image
          </span>
        </label>
        <input
          type="file"
          id="fileInput"
          ref={fileInputRef}
          onChange={(event) => setImageUpload(event.target.files[0])}
          accept="image/*"
          style={{ display: 'none' }}
        />
        <span className="file-upload-status">
          {imageUpload ? <span class="material-symbols-outlined">
            done
          </span> : <span class="material-symbols-outlined">
            close
          </span>}
        </span>
      </form>
    </div>
  );
};

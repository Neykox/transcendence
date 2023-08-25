import './App.css';
import { Navigate, Routes, Route } from 'react-router-dom';
import Login from './components/Login/Login';
import Profile from './components/User/Profile/Profile';
import Message from './components/User/Message/Message';
import Settings from './components/User/Settings/Settings';
import Chat from './components/User/Message/Chat/Chat';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Page1 from './components/page1';
import TwoFa from './components/TwoFa/TwoFa';
import Lobby from './components/Pong/Lobby';
import { UserProvider } from './model/userContext';
import { useState, useEffect } from 'react';
import Channel from './components/User/Channel/Channel';
import ChannelChat from './components/User/Channel/ChannelChat/ChannelChat';

function App() {
  const [connected, setConnected] = useState(false);
  const [storage, setStorage] = useState(localStorage.getItem("user"));

  const clearCookie = async () => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ title: 'React POST Request Example' })
    };

    await fetch('http://localhost:5000/auth/clear_cookie', requestOptions);
  };

  // const handleStorageChange = (event: StorageEvent) => {
  //   if (storage === null) {
  //     clearCookie();
  //     setConnected(false);
  //     console.log('disconnected');
  //   } else {
  //     setConnected(true);
  //     console.log("connected");
  //   }
  // };

  //useEffect(() => {
  //  handleStorageChange(storage);
  //}, [storage])

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (storage === null) {
        clearCookie();
        setConnected(false);
        console.log('disconnected');
      } else {
        setConnected(true);
        console.log("connected");
      }
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [storage]);

  useEffect(() => {
    if (storage != null) {
      setConnected(true);
      console.log("Connected");
    }
  }, [storage])

  return (
    <UserProvider>
      <div className="App">
        {/* <h1>Home</h1> */}
        <ToastContainer />
        <Routes>
          {connected ? (
            <Route path="/" element={<Navigate to="/profile" />} />
          ) : (
            <Route path="/" element={<Login setStorage={setStorage} />} />
          )}
          <Route
            path="/profile"
            element={connected ? <Profile /> : <Navigate to="/" />}
          />
          <Route path="/message" element={<Message />}>
            <Route path="/message/:id" element={<Chat />} />
          </Route>
          <Route path="/settings" element={<Settings />} />
          <Route path="/page1" element={<Page1 />} />
          <Route path="/twofa" element={<TwoFa />} />
          <Route path='/lobby' element={<Lobby />} />
          <Route path='/channel' element={<Channel />} />
          <Route path="/channel/:id" element={<ChannelChat />} />
        </Routes>
      </div>
    </UserProvider>
  );
}

export default App;

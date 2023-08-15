import './App.css';
import { Routes, Route } from 'react-router-dom';
import Login from './components/Login/Login';
import Profile from './components/User/Profile/Profile';
import Message from './components/User/Message/Message';
import Chat from './components/User/Message/Chat/Chat';
import Channel from './components/User/Channel/Channel';
import ChannelChat from './components/User/Channel/ChannelChat/ChannelChat';

function App() {
  return (
    <div className="App">
      {/* <h1>Home</h1> */}
      <Routes>
        <Route path='/' element={<Login />}></Route>
        <Route path='/profile' element={<Profile />}></Route>
        <Route path='/message' element={<Message />}>
          <Route path="/message/:id" element={<Chat />} />
        </Route>
        <Route path='/channel' element={<Channel />}>
          <Route path="/channel/:id" element={<ChannelChat />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;

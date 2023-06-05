import './App.css';
import { Routes, Route } from 'react-router-dom';
import Login from './components/Login/Login';
import Profile from './components/User/Profile/Profile';
import Message from './components/User/Message/Message';
import Settings from './components/User/Settings/Settings';
import Chat from './components/User/Message/Chat/Chat';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Page1 from './components/page1';
import Page2 from './components/page2';

function App() {
  return (
    <div className="App">
      {/* <h1>Home</h1> */}
      <ToastContainer />
      <Routes>
        <Route path='/' element={<Login />}></Route>
        <Route path='/profile' element={<Profile />}></Route>
        <Route path='/message' element={<Message />}>
          <Route path="/message/:id" element={<Chat />} />
        </Route>
        <Route path='/settings' element={<Settings />}></Route>
        <Route path='/page1' element={<Page1 />}></Route>
        <Route path='/page2' element={<Page2 />}></Route>
      </Routes>
    </div>
  );
}

export default App;

import './ChannelChat.scss';
import { socket } from '../../../Socket/socketInit';
import UserContext from '../../../../model/userContext';
import { useEffect, useRef, useState, useContext, useCallback } from 'react';
import { useLocation } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type ChatMessage = {
    conversationOwner: string;
    who: string;
    author: string;
    message: string;
};

type member = {
    id: number;
    login: string;
}

const allMesage: ChatMessage[] = [];

export default function Chat() {
    const { user } = useContext(UserContext);
    const location = useLocation();
    const channel = location.state.channel;
    const lastMessageRef = useRef<HTMLDivElement>(null);
    const [showModal, setShowModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passwordInput, setPasswordInput] = useState('');
    const [channelMembers, setChannelMembers] = useState<member[]>([]);
    const [currentUser, setCurrentUser] = useState<string>('');

    const [inputValue, setInputValue] = useState('');
    const [messages, setMessages] = useState<ChatMessage[]>([

    ]);

    useEffect(() => {
        const message = allMesage.filter(message => message.conversationOwner === channel.owner);
        //console.log("1");
        if (message.length > 0) {
            setMessages(message);
        } else {
            setMessages([]);
        }
    }, [channel.owner]);

    useEffect(() => {
        lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const openModal = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInputValue(event.target.value);
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (inputValue.trim() === '') {
            return;
        }

        const newMessage: ChatMessage = {
            conversationOwner: channel.owner,
            who: 'me',
            author: 'Vous',
            message: inputValue.trim(),
        };

        allMesage.push(newMessage);

        setMessages((prevMessages) => [...prevMessages, newMessage]);
        socket.emit("send_message", { channelId: channel.id, newMessage: newMessage });
        setInputValue('');
    };

    const contactSendMessage = (data) => {
        // const newMessage: ChatMessage = {
        //     conversationOwner: channel.owner,
        //     who: 'contact',
        //     author: `${channel.name}`,
        //     message: "Coucou"
        // };
        
        data.who = 'contact';
        data.author = `${channel.name}`;
        const newMessage: ChatMessage = data;

        setMessages((prevMessages) => [...prevMessages, newMessage]);
    }

    const myEventHandler2 = useCallback(data => {
        // console.log(data);
        contactSendMessage(data);
    }, []);

    useEffect(() => {
      socket.on('newMessage', myEventHandler2);
      return () => socket.off('newMessage', myEventHandler2);
    }, [myEventHandler2]);

    const deleteChannel = () => {
        fetch(`http://localhost:5000/channels/${channel.id}`, { method: "DELETE" });
    }

    const joinChannel = async () => {
        if (channel.type === 'protected') {
            setShowPasswordModal(true);
        } else {
            const newUser = user.pseudo;
            // setChannelMembers((prevMembers) => [...prevMembers, newUser]);
        }
        await fetch('http://localhost:5000/channels/addUser',
            {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    channelId: channel.id,
                    newUser: { id: socket.id, login: socket.id/*user.login*/ }
                }),
            });
        // console.log(await response.json())
        socket.emit("joinChannel", { channelId: channel.id});
    }

    const handleLeaveChannel = useCallback( async () => {
        await fetch('http://localhost:5000/channels/removeUser',
            {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    channelId: channel.id,
                    newUser: { id: socket.id, login: socket.id/*user.login*/ }
            }),
        });
        socket.emit("leaveChannel", { channelId: channel.id});
    }, [channel.id]);//quit / kick button

    async function handleKick(target) {
        socket.emit("kick", { channelId: channel.id, user: target.login});
    }

    const onKick = useCallback( () => {
        handleLeaveChannel();
    }, [handleLeaveChannel]);

    useEffect(() => {
      socket.on('kicked', onKick);
      return () => socket.off('kicked', onKick);
    }, [onKick]);

    const getMembersEvent = useCallback( async () => {
        const response = await fetch('http://localhost:5000/channels/getMembers',
            {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ channelId: channel.id }),
            });
        const data = await response.json();
        let index = 0;
        let newMatchs: member[] = [];
        while (data[index])
        {
            // newMatchs.unshift(data[index]);
            newMatchs.push(data[index]);
            index++;
        }
        setChannelMembers(newMatchs)
    }, [channel.id]);

    useEffect(() => {
      socket.on('getMembers', getMembersEvent);
      return () => socket.off('getMembers', getMembersEvent);
    }, [getMembersEvent]);

    const getTime = () => {
        const date = new Date();

        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        const formattedDate = `Le ${day}/${month} à ${hours}:${minutes}`
        return (formattedDate);
    }

    const handlePasswordInputChange = (event) => {
        setPasswordInput(event.target.value);
    };

    const handlePasswordSubmit = () => {
        // trouve bine le channel.name mais channel.password indefini
        const correctPassword = channel.password;
        console.log(correctPassword);
        console.log(channel.name);
        if (passwordInput === correctPassword) {
            toast.success('Mot de passe correct !');
            setShowPasswordModal(false);
            const newUser = user.pseudo;
            setChannelMembers((prevMembers) => [...prevMembers, newUser]);
            setPasswordInput('');
        } else {
            toast.error('Mot de passe incorrect. Veuillez réessayer.');
            setShowPasswordModal(false);
        }
    };

    return (
        <div className='chat'>
            <div className="channelInfo">
                <h2>{channel.name}</h2>
                {// ici pas besoin de rajouter si public et protected car les privé ne sont pas visible mais plus securisé ? 
                }
                {(channel.type === 'public' || channel.type === 'protected') && (
                    <button onClick={joinChannel}>Rejoindre</button>
                )}

                <button onClick={handleLeaveChannel}>Leave un canal</button>
                <button onClick={deleteChannel} >delete</button>
                <button onClick={openModal}>Membres</button>
                <div className={`${channel.type}`}></div>
            </div>
            <div className="chatBox">
                <div className="chatMessage">
                    {messages.map((message, index) => (
                        <div key={index} className={`chatMessageBox ${message.who}`} ref={messages.length - 1 === index ? lastMessageRef : null}>
                            <div className="userInfo">
                                <span className="author">{message.author}: </span>
                                <span className="date">{getTime()}</span>
                            </div>
                            <div className="messageChat">
                                <span className="chatText">{message.message}</span>
                            </div>
                        </div>
                    ))}
                </div>
                <form onSubmit={handleSubmit}>
                    <textarea
                        value={inputValue}
                        onChange={handleInputChange}
                        placeholder="Entrer votre message ici"
                    />
                    <button type="submit">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M21.7264 2.95706L16.2732 22.0433C16.1222 22.5718 15.7976 22.5958 15.5561 22.1127L10.9998 13.0002L1.92266 9.36931C1.41298 9.16544 1.41929 8.86034 1.9567 8.6812L21.0429 2.31913C21.5714 2.14297 21.8745 2.43878 21.7264 2.95706ZM19.0351 5.0966L6.81197 9.17097L12.4486 11.4256L15.4893 17.507L19.0351 5.0966Z"></path></svg>
                    </button>
                </form>
                <button onClick={contactSendMessage}>Contact Send</button>
            </div>
            {showPasswordModal && (
                <div className="passwordModal">
                    <h3>Entrez le mot de passe :</h3>
                    <input
                        type="password"
                        value={passwordInput}
                        onChange={handlePasswordInputChange}
                    />
                    <button onClick={handlePasswordSubmit}>Valider</button>
                </div>
            )}
            {showModal && (
                <div className="modal">
                    <h3>Liste des membres</h3>
                    <ul>
                        {channelMembers.map((user, index) => (
                            <li key={index}>
                                <div className="user-name">{user.login}</div>
                                <div className="button-container">
                                    <button>ban</button>
                                    <button onClick={() => handleKick(user)}>kick</button>
                                    <button>mute</button>
                                </div>
                            </li>

                        ))}
                        <button onClick={closeModal}>Close</button>
                    </ul>
                </div>
            )}
        </div>
    );
}

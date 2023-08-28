import './ChannelChat.scss';
import { socket } from '../../../Socket/socketInit';
import UserContext from '../../../../model/userContext';
import { useEffect, useRef, useState, useContext, useCallback } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DuelButton from '../../../Pong/DuelButton';

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
    const navigate = useNavigate();
    const location = useLocation();
    const channel = (location.state ? location.state.channel : "rip");
    const lastMessageRef = useRef<HTMLDivElement>(null);
    const [showModal, setShowModal] = useState(false);
    const [showBannedModal, setShowBannedModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
	const [showChannelOptionModal, setShowChannelOptionModal] = useState(false);
    const [passwordInput, setPasswordInput] = useState('');
    const [channelMembers, setChannelMembers] = useState<member[]>([]);
    const [channelBanned, setChannelBanned] = useState<member[]>([]);
    const [blocked, setBlocked] = useState<string[]>([]);
	const [newChannelName, setNewChannelName] = useState<string>('');
    const [newChannelType, setNewChannelType] = useState<string>('public');
	const [newChannelPassword, setNewChannelPassword] = useState('');
    const [inputValue, setInputValue] = useState('');
    const [messages, setMessages] = useState<ChatMessage[]>([

    ]);

    useEffect(() => {

        //check for potential errors
        if (location.state === null)
            navigate(-1);
        const fetchChannel = async () => {
            const response = await fetch(`http://${process.env.REACT_APP_POSTURL}:5000/channels/${channel.id}`, { method: "GET" });
            if (response.status === 403)
                navigate(-1);
        };
        fetchChannel();

        //check for join
        if (channel.type === 'protected')
            setShowPasswordModal(true);
        else
        {
            let user2 = localStorage.getItem('user');
            if (user2 === null)
                return;
            let data = JSON.parse(user2);
            console.log(data.login)
            socket.emit("joinChannel", { channelId: channel.id,  userId: data.id, userLogin: data.login });
        }


        const message = allMesage.filter(message => message.conversationOwner === channel.owner);
        //console.log("1");
        if (message.length > 0) {
            setMessages(message);
        } else {
            setMessages([]);
        }
    }, [channel, user, navigate, location]);

    useEffect(() => {
        lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const openModal = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const openBannedModal = () => {
        setShowBannedModal(true);
    };

    const closeBannedModal = () => {
        setShowBannedModal(false);
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInputValue(event.target.value);
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (inputValue.trim() === '' || showPasswordModal === true) {
            return;
        }

        const newMessage: ChatMessage = {
            conversationOwner: channel.owner,
            who: user.login,//'me',
            author: user.login,//'Vous',
            message: inputValue.trim(),
            time: getTime(),
            origin: channel.id,
        };
        socket.emit("send_message", { channelId: channel.id, newMessage: newMessage, userId: user.id});
        setInputValue('');
    };

    // const contactSendMessage = (data) => {
    //     // if (data.owner not blocked && data.newMessage.origin === channel.id)
    //     // {
    //         data.who = (user.login === data.who ? 'me' : 'contact');
    //         const newMessage: ChatMessage = data;
    //         setMessages((prevMessages) => [...prevMessages, newMessage]);
    //     // }
    // }

    const myEventHandler2 = useCallback(data => {
        console.log(blocked)
        console.log(blocked.indexOf(data.author))
        if (data.origin === channel.id && blocked.indexOf(data.author) === -1 )
        {
            data.who = (user.login === data.who ? 'me' : 'contact');
            const newMessage: ChatMessage = data;
            setMessages((prevMessages) => [...prevMessages, newMessage]);
        }
    }, [user, channel, blocked]);

    useEffect(() => {
      socket.on('newMessage', myEventHandler2);
      return () => socket.off('newMessage', myEventHandler2);
    }, [myEventHandler2]);

    const deleteChannel = () => {
        if (channel.owner === user.login)
        {
            fetch(`http://${process.env.REACT_APP_POSTURL}:5000/channels/${channel.id}`, { method: "DELETE" });
            navigate("/channel");
        }
        else
            console.log("only owner can deleteChannel");
    }

    /*****************************************************************************/

    // const joinChannel = () => {
    //     if (channel.type === 'protected')
    //         setShowPasswordModal(true);
    //     else
    //         socket.emit("joinChannel", { channelId: channel.id, newUser: { id: user.id, login: user.login }});
    //     socket.emit("joinChannel", { channelId: channel.id, newUser: { id: user.id, login: user.login }});
    // }

    const handleLeaveChannel = useCallback( async () => {
        socket.emit("leaveChannel", { channelId: channel.id,  userId: user.id, userLogin: user.login });
        setChannelMembers([]);
        navigate("/channel");
    }, [channel, user, navigate]);//quit / kick button

    /*****************************************************************************/

    async function handleBan(target) {
        socket.emit("ban", { channelId: channel.id,  userId: user.id, userLogin: user.login, targetId: target.id, targetLogin: target.login });
    }

    async function handleUnban(target) {
        socket.emit("unban", { channelId: channel.id,  userId: user.id, userLogin: user.login, targetId: target.id, targetLogin: target.login });
    }

    /*****************************************************************************/

    async function handleAdmin(target) {
        socket.emit("admin", { channelId: channel.id,  userId: user.id, userLogin: user.login, targetId: target.id, targetLogin: target.login });
    }

    async function handleUnadmin(target) {
        socket.emit("unadmin", { channelId: channel.id,  userId: user.id, userLogin: user.login, targetId: target.id, targetLogin: target.login });
    }

    /*****************************************************************************/

    async function handleMute(target) {
        socket.emit("mute", { channelId: channel.id,  userId: user.id, userLogin: user.login, targetId: target.id, targetLogin: target.login });
    }

    // async function handleIsMuted(target) {
    //     socket.emit("ismuted", { channelId: channel.id, user: target.id});
    // }

    /*****************************************************************************/

    async function handleKick(target) {
        socket.emit("kick", { channelId: channel.id,  userId: user.id, userLogin: user.login, targetId: target.id, targetLogin: target.login });
    }

    const onKick = useCallback( () => {
        handleLeaveChannel();
    }, [handleLeaveChannel]);

    useEffect(() => {
      socket.on('kicked', onKick);
      return () => socket.off('kicked', onKick);
    }, [onKick]);

    /*****************************************************************************/

    const getMembersEvent = useCallback( async () => {
        const response = await fetch('http://' + process.env.REACT_APP_POSTURL + ':5000/channels/getMembers',
            {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ channelId: channel.id,  userId: 0, userLogin: "",  targetId: 0, targetLogin: "" }),
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


        const response2 = await fetch(`http://${process.env.REACT_APP_POSTURL}:5000/banned/${channel.id}`);
        if (!response2 || response2.status !== 200)
                return;
        const data2 = await response2.json();
        index = 0;
        let newBanned: member[] = [];
        while (data2[index])
        {
            // newMatchs.unshift(data[index]);
            newBanned.push(data2[index]);
            index++;
        }
        setChannelBanned(newBanned)

        const response3 = await fetch('http://' + process.env.REACT_APP_POSTURL + ':5000/blocked', { credentials: 'include', });
        if (!response3 || response3.status !== 200)
                return;
        console.log("status", response3.status)
        const data3 = await response3.json();
        console.log("data3",data3)
        setBlocked(data3);
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

    const handlePasswordSubmit = async () => {
        socket.emit("passwordCheck", { id: channel.id,  password: passwordInput })
    };

    const joinProtected = useCallback( async (data) => {
        console.log("data.check = ", data.check);
        if (data.check === true) {
            toast.success('Mot de passe correct !');
            setShowPasswordModal(false);
            socket.emit("joinChannel", { channelId: channel.id,  userId: user.id, userLogin: user.login });
            setPasswordInput('');
        } else {
            toast.error('Mot de passe incorrect. Veuillez réessayer.');
            setPasswordInput('');
        }
    }, [channel.id, user]);

    useEffect(() => {
      socket.on('passwordChecked', joinProtected);
      return () => socket.off('passwordChecked', joinProtected);
    }, [joinProtected]);

	const updateChannel = async (newChannel) => {
		const response = await fetch(`http://${process.env.REACT_APP_POSTURL}:5000/channels/${channel.id}`, {
			method: "PATCH",
			headers: { 'Content-Type': 'application/json' },
			credentials: 'include',
			body: JSON.stringify(newChannel),
		});
		if (response.status === 200) {
			navigate("/channel");
		}
	}

	const handleModalSubmit = () => {
        if (newChannelName.trim() !== '') {
            const newChannel = {
                owner: user.login,
                name: newChannelName,
                type: newChannelType,
                password: newChannelPassword,
            };

            updateChannel(newChannel);
            setShowChannelOptionModal(false);
        }
    }

    return (
        <div className='chat'>
            <div className="channelInfo">
                <h2>{channel.name}</h2>
                {// ici pas besoin de rajouter si public et protected car les privé ne sont pas visible mais plus securisé ? 
                }

                <button onClick={handleLeaveChannel}>Leave un canal</button>
                <button onClick={deleteChannel} >delete</button>
                <button onClick={openModal}>Membres</button>
                <button onClick={openBannedModal}>Banned</button>
                <button onClick={() => {setShowChannelOptionModal(true)}}>update channel</button>
                <div className={`${channel.type}`}></div>
            </div>
            <div className="chatBox">
                <div className="chatMessage">
                    {messages.map((message, index) => (
                        <div key={index} className={`chatMessageBox ${message.who}`} ref={messages.length - 1 === index ? lastMessageRef : null}>
                            <div className="userInfo">
                                <span className="author">{message.author}: </span>
                                <span className="date">{message.time}</span>
                            </div>
                            <div className="messageChat">
                                <span className="chatText">{message.message}</span>
                            </div>
                        </div>
                    ))}
                </div>
                <form onSubmit={handleSubmit}>
                    <input type="text" placeholder="Enter your message" value={inputValue} onChange={handleInputChange} />
                    <button type="submit">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M21.7264 2.95706L16.2732 22.0433C16.1222 22.5718 15.7976 22.5958 15.5561 22.1127L10.9998 13.0002L1.92266 9.36931C1.41298 9.16544 1.41929 8.86034 1.9567 8.6812L21.0429 2.31913C21.5714 2.14297 21.8745 2.43878 21.7264 2.95706ZM19.0351 5.0966L6.81197 9.17097L12.4486 11.4256L15.4893 17.507L19.0351 5.0966Z"></path></svg>
                    </button>
                </form>
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
                                    <button onClick={() => handleBan(user)}>ban</button>
                                    <button onClick={() => handleKick(user)}>kick</button>
                                    <button onClick={() => handleMute(user)}>mute</button>
                                    <button onClick={() => handleAdmin(user)}>admin</button>
                                    <button onClick={() => handleUnadmin(user)}>unadmin</button>
                                    <DuelButton login={user.login}/>
                                </div>
                            </li>

                        ))}
                        <button onClick={closeModal}>Close</button>
                    </ul>
                </div>
            )}
            {showBannedModal && (
                <div className="modal">
                    <h3>Liste des banned</h3>
                    <ul>
                        {channelBanned.map((user, index) => (
                            <li key={index}>
                                <div className="user-name">{user.login}</div>
                                <div className="button-container">
                                    <button onClick={() => handleUnban(user)}>unban</button>
                                </div>
                            </li>

                        ))}
                        <button onClick={closeBannedModal}>Close</button>
                    </ul>
                </div>
            )}
			{showChannelOptionModal && (
				<div className="modal">
					<h3>Channel Options</h3>
					<input
                        type="text"
                        placeholder="Nom du canal"
                        value={newChannelName}
                        onChange={(e) => setNewChannelName(e.target.value)}
                    />
                    <select value={newChannelType} onChange={(e) => setNewChannelType(e.target.value)}>
                        <option value="public">public</option>
                        <option value="protected">protégé</option>
                    </select>
                    {newChannelType === "protected" ? (
                        <input
                            type="password"
                            placeholder="Mot de passe du canal"
                            value={newChannelPassword}
                            onChange={(e) => setNewChannelPassword(e.target.value)}
                        />
                    ) : null}
                    <button onClick={handleModalSubmit}>Mettre a jour</button>
                    <button onClick={() => {setShowChannelOptionModal(false)}}>Annuler</button>
				</div>
				)
			}
        </div>
    );
}

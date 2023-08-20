import './ChannelChat.scss';

import { useEffect, useRef, useState } from 'react';
import { useLocation } from "react-router-dom";


type ChatMessage = {
    conversationOwner: string;
    who: string;
    author: string;
    message: string;
};

const allMesage: ChatMessage[] = [];

export default function Chat() {
    const location = useLocation();
    const channel = location.state.channel;
    const lastMessageRef = useRef<HTMLDivElement>(null);

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
        setInputValue('');
    };

    const contactSendMessage = () => {
        const newMessage: ChatMessage = {
            conversationOwner: channel.owner,
            who: 'contact',
            author: `${channel.name}`,
            message: "Coucou"
        };

        setMessages((prevMessages) => [...prevMessages, newMessage]);
    }

    const deleteChannel = () => {
        const response = fetch(`http://localhost:5000/channels/${channel.owner}`, { method: "DELETE" });
    }

    const getTime = () => {
        const date = new Date();

        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        const formattedDate = `Le ${day}/${month} à ${hours}:${minutes}`
        return (formattedDate);
    }


    return (
        <div className='chat'>
            <div className="channelInfo">
                <h2>{channel.name}</h2>
                <button onClick={deleteChannel} >delete</button>
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
        </div>
    );
}

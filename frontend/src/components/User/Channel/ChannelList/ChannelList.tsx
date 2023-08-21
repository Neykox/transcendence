import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import Modal from 'react-modal';
import './ChannelList.scss';

import UserContext from '../../../../model/userContext';
import { socket } from '../Socket/socketInit';

interface HistoryProps {
    channels: Array<{ owner: string; name: string; type: string; password: string }>;
    addChannel: (newChannel: { owner: string; name: string; type: string; password: string }) => void;
}

function ChannelList({ channels, addChannel }: HistoryProps) {
    const [selectedChannelOwner, setSelectedChannelOwner] = useState<string | null>(null);
    const [newChannelName, setNewChannelName] = useState<string>('');
    const [newChannelType, setNewChannelType] = useState<string>('public');
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [newChannelPassword, setNewChannelPassword] = useState('');
    const { user } = useContext(UserContext);

    const handleSelectMessage = (owner: string) => {
        setSelectedChannelOwner(owner);
    }

    const handleAddChannel = () => {
        setIsModalOpen(true);
    }

    const handleModalClose = () => {
        setIsModalOpen(false);
    }

    const handleModalSubmit = () => {
        if (newChannelName.trim() !== '') {
            const newChannel = {
                owner: user.login,
                name: newChannelName,
                type: newChannelType,
                password: newChannelPassword,
            };

            addChannel(newChannel);
            setNewChannelName('');
            setNewChannelPassword('');
            setIsModalOpen(false);
        }
    }

    const handleJoinChannel = () => {
        // associé le channel a l'user
        // socket.emit("updatePlayer", {"p":{dir: -1, room:p1.current.room, socketId:p1.current.socketId}});
    }

    // const myEventHandler = useCallback(data => {
    //     setEnded(true);
    //     let score;
    //     if (data.p1.socketId === socket.id)
    //         score = { id: Date().toLocaleString(), opponent: data.p2.name, scores: data.p1.score + "/" + data.p2.score, result: data.p1.score > data.p2.score ? "matchWin" : "matchLose" };
    //     else
    //         score = { id: Date().toLocaleString(), opponent: data.p1.name, scores: data.p2.score + "/" + data.p1.score, result: data.p2.score > data.p1.score ? "matchWin" : "matchLose" };
    //     const requestOptions = {
    //         method: "POST",
    //         headers: { "Content-Type": "application/json" },
    //         credentials: "include",
    //         body: JSON.stringify({ "score": score }),
    //     };
    //     fetch("http://localhost:5000/users/addGameToHistory", requestOptions);
    // }, []);

    // useEffect(() => {
    //     socket.on('score', myEventHandler);
    //     return () => socket.off('score', myEventHandler)
    // }, [myEventHandler]);

    return (
        <div className="channelList">
            {channels.map((channel) => (
                <Link to={`/channel/${channel.owner}`} state={{ channel: channel }} key={channel.owner}>
                    <div className={`channel ${selectedChannelOwner === channel.owner ? 'selected' : ''}`} onClick={() => handleSelectMessage(channel.owner)}>
                        <h2>{channel.name}</h2>
                        <div className={`${channel.type}`}></div>
                    </div>
                </Link>
            ))}

            <div className="button-container">
                <button className="add-channel-button" onClick={handleAddChannel}>
                    Ajouter un canal
                </button>
                {//<button className="join-channel-button" onClick={handleJoinChannel}>
                    //Rejoindre un canal
                    //</button>
                }

                { }
                <Modal className="Modal" isOpen={isModalOpen} onRequestClose={handleModalClose}>
                    <h2>Ajouter un nouveau canal</h2>
                    <input
                        type="text"
                        placeholder="Nom du canal"
                        value={newChannelName}
                        onChange={(e) => setNewChannelName(e.target.value)}
                    />
                    <select value={newChannelType} onChange={(e) => setNewChannelType(e.target.value)}>
                        <option value="public">public</option>
                        <option value="private">privé</option>
                        <option value="protected">protégé</option>
                    </select>
                    {newChannelType === "private" || newChannelType === "protected" ? (
                        <input
                            type="password"
                            placeholder="Mot de passe du canal"
                            value={newChannelPassword}
                            onChange={(e) => setNewChannelPassword(e.target.value)}
                        />
                    ) : null}
                    <button onClick={handleModalSubmit}>Ajouter</button>
                    <button onClick={handleModalClose}>Annuler</button>
                </Modal>
            </div>
        </div>
    );
}

export default ChannelList;
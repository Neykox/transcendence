import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Modal from 'react-modal';
import './ChannelList.scss';


interface HistoryProps {
    channels: Array<{ id: number; name: string; status: string }>;
    addChannel: (newChannel: { id: number; name: string; status: string }) => void;
}

function ChannelList({ channels, addChannel }: HistoryProps) {
    const [selectedChannelId, setSelectedChannelId] = useState<number | null>(null);
    const [newChannelName, setNewChannelName] = useState<string>('');
    const [newChannelStatus, setNewChannelStatus] = useState<string>('offline');
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const handleSelectMessage = (id: number) => {
        setSelectedChannelId(id);
    }

    const handleAddChannel = () => {
        setIsModalOpen(true);
    }

    const handleModalClose = () => {
        setIsModalOpen(false);
    }

    const handleModalSubmit = () => {
        if (newChannelName.trim() !== '') {
            const newChannel: { id: number; name: string; status: string } = {
                id: channels.length + 1,
                name: newChannelName,
                status: newChannelStatus,
            };

            addChannel(newChannel);
            setNewChannelName('');
            setIsModalOpen(false);
        }
    }

    const handleJoinChannel = () => {
        // associé le channel a l'user 
    }

    return (
        <div className="channelList">
            {channels.map((channel) => (
                <Link to={`/channel/${channel.id}`} state={{ channel: channel }} key={channel.id}>
                    <div className={`channel ${selectedChannelId === channel.id ? 'selected' : ''}`} onClick={() => handleSelectMessage(channel.id)}>
                        <h2>{channel.name}</h2>
                        <div className={`${channel.status}`}></div>
                    </div>
                </Link>
            ))}

            <div className="button-container">
                <button className="add-channel-button" onClick={handleAddChannel}>
                    Ajouter un canal
                </button>
                <button className="join-channel-button" onClick={handleJoinChannel}>
                    Rejoindre un canal
                </button>

                {/* revoir le CSS des Modal qui ne fonctionne pas */}
                <Modal isOpen={isModalOpen} onRequestClose={handleModalClose}>
                    <h2>Ajouter un nouveau canal</h2>
                    <input
                        type="text"
                        placeholder="Nom du canal"
                        value={newChannelName}
                        onChange={(e) => setNewChannelName(e.target.value)}
                    />
                    <select value={newChannelStatus} onChange={(e) => setNewChannelStatus(e.target.value)}>
                        <option value="privé">privé</option>
                        <option value="public">public</option>
                    </select>
                    <button onClick={handleModalSubmit}>Ajouter</button>
                    <button onClick={handleModalClose}>Annuler</button>
                </Modal>
            </div>
        </div>
    );
}

export default ChannelList;
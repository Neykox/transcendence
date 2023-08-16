import './Channel.scss';
import NavBar from "../../NavBar/NavBar";
import ChannelList from './ChannelList/ChannelList';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';


function randomName() {
    const Names = ["bienvenue", "channel1", "channel2"]

    const randomIndex = Math.floor(Math.random() * Names.length);
    return Names[randomIndex];
}

// voir plutot un booleen pour le status (menu deroulant de la modale pour dire si privé ou public)
function Channel() {
    interface Channels {
        id: number;
        name: string;
        status: string;
    }


    const [channels, setChannels] = useState<Channels[]>([
        { id: 1, name: "Bienvenue", status: "public" },
        { id: 2, name: "channel1", status: "public" },
        { id: 3, name: "channel2", status: "private" },
    ]);

    const addChannel = (newChannel: Channels) => {
        setChannels(prevChannels => [...prevChannels, newChannel]);
    };


    // faire en sorte que les channel qui s'affiche ne soit que ceux de l'utilisateur et non toute la liste 
    return (
        <div className="message">
            <NavBar />
            <div className="content">
                <ChannelList channels={channels} addChannel={addChannel} />
                <Outlet></Outlet>
            </div>
        </div>
    );
}

export default Channel;

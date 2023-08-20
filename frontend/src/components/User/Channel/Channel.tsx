import './Channel.scss';
import NavBar from "../../NavBar/NavBar";
import ChannelList from './ChannelList/ChannelList';
import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';


function randomName() {
	const Names = ["bienvenue", "channel1", "channel2"]

	const randomIndex = Math.floor(Math.random() * Names.length);
	return Names[randomIndex];
}

// voir plutot un booleen pour le status (menu deroulant de la modale pour dire si privé ou public)
function Channel() {
	interface Channels {
		owner: string;
		name: string;
		type: string;
		password: string;
	}


	const [channels, setChannels] = useState<Channels[]>([]);

	const addChannel = async (newChannel) => {
		console.log("newChannel = ", newChannel)
		await fetch('http://localhost:5000/channels/create',
		{
			method: "POST",
			headers: { 'Content-Type': 'application/json' },
			credentials: 'include',
			body: JSON.stringify(newChannel),
		});
		setChannels(prevChannels => [...prevChannels, newChannel]);
	};

	useEffect(() => {
		const fetchChannels = async () => {
			const response = await fetch('http://localhost:5000/channels', { method: "GET" });
			let data = await response.json();
			if (!data)
				return ;
			console.log("channels = ", data);
			let index = 0;
			let newChannels: Channels[] = [];
			while (data[index])
			{
				newChannels.unshift(data[index]);
				index++;
			}
			setChannels(newChannels);
		};
		fetchChannels();
	}, []);


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

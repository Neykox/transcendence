import './Channel.scss';
import NavBar from "../../NavBar/NavBar";
import ChannelList from './ChannelList/ChannelList';
import { useState, useEffect, useCallback, useContext } from 'react';
import { Outlet } from 'react-router-dom';
import UserContext from '../../../model/userContext';

// voir plutot un booleen pour le status (menu deroulant de la modale pour dire si privé ou public)
function Channel() {
	interface Channels {
		owner: string;
		name: string;
		type: string;
		password: string;
		dm: string;
	}

	const { user } = useContext(UserContext);
	const [channels, setChannels] = useState<Channels[]>([]);
	const channelsNoPrivate = channels.filter(channel => {return user.login === channel.owner || user.login === channel.dm});

	const fetchChannels = useCallback(async () => {
		const response = await fetch('http://localhost:5000/channels', { method: "GET" });
		let data = await response.json();
		if (!data)
			return;
		console.log("channels = ", data);
		let index = 0;
		let newChannels: Channels[] = [];
		while (data[index]) {
			newChannels.unshift(data[index]);
			index++;
		}
		setChannels(newChannels);
	}, []);

	const addChannel = async (newChannel) => {
		await fetch('http://localhost:5000/channels/create',
		{
			method: "POST",
			headers: { 'Content-Type': 'application/json' },
			credentials: 'include',
			body: JSON.stringify(newChannel),
		});
		fetchChannels();
	};

	useEffect(() => {
		fetchChannels();
	}, [fetchChannels]);


	// faire en sorte que les channel qui s'affiche ne soit que ceux de l'utilisateur et non toute la liste 
	return (
		<div className="message">
			<NavBar />
			<div className="content">
				<ChannelList channels={channelsNoPrivate} addChannel={addChannel} />
				<Outlet></Outlet>
			</div>
		</div>
	);
}

export default Channel;

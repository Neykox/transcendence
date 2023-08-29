import './UserOptions.scss';
// import { useState } from 'react';
import {socket} from '../../../Socket/socketInit'

interface OptionsProps {
	profile: any;
}

export default function UserOptions({profile} : OptionsProps) {

	// const [isblocked, blocked] = useState(false);


	const blockUser = async () => {
		await fetch("http://" + process.env.REACT_APP_POSTURL + ":5000/blocked/", {method: "POST", credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ login: profile.login})});
	}

	const unblockUser = async () => {
		await fetch("http://" + process.env.REACT_APP_POSTURL + ":5000/blocked/", {method: "DELETE", credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ login: profile.login})})
	}

	const addFriend = async () => {
		let user = localStorage.getItem('user');
		if (user === null)
			return;
		let data = JSON.parse(user);
		console.log(data['login'], data.login)
		socket.emit('sendFriend', { to: profile.login, from: data['login'], fromUsername: data['pseudo'] }, (data: string) => console.log(data))
	}

	return (
		<div className="userOptions">
			<h1>User options</h1>
			<button className='addFriend' onClick={() => addFriend()}>{"INVITE " + profile.username + " AS FRIEND"}</button>
			<button className='blockUser' onClick={() => blockUser()}>{"BLOCK " + profile.username}</button>
			<button className='unblockUser' onClick={() => unblockUser()} >{"UNBLOCK " + profile.username}</button>
		</div>
	);
}

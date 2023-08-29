import React, { useEffect, useState } from 'react';
import './AddFriend.scss';
import addButton from '../../../../asset/images/add-circle.svg';
import { socket } from '../../../Socket/socketInit';
import userImg from '../../../../asset/images/user.png';

interface AddFriendProps {
	friends: Array<{ id: number; pseudo: string; status: string; }>;
}

interface Friends {
	id: number;
	pseudo: string;
	login: string;
	status: string;
}

export default function FriendList({ friends }: AddFriendProps) {
	const [users, setUsers] = useState<Friends[]>([]);

	useEffect(() => {
		
		const fetchUsers = async (): Promise<Friends[]> => {
			const response = await fetch('http://' + process.env.REACT_APP_POSTURL + ':5000/users');
			const data = await response.json();
			const friendsData: Friends[] = data.map((user: any) => ({
				id: user.id,
				pseudo: user.pseudo,
				login: user.login,
				status: user.status,
			}));
			return friendsData;
		};
	
		const getUsers = async () => {
			const fetchedUsers = await fetchUsers();
			setUsers(fetchedUsers);
		};
	
		getUsers();
	});

	const sendFriend = (name: string) => {
		let user = localStorage.getItem('user');
		if (user === null)
			return;
		let data = JSON.parse(user);
		console.log(data['login'], data.login)
		socket.emit('sendFriend', { to: name, from: data['login'], fromUsername: data['pseudo'] }, (data: string) => console.log(data))
	}
	return (
		<div className="friend-list">
			{users.map((user) => (
				<div className="friend" key={user.id}>
					<div className="friend-avatar"><img src={userImg} alt="userImg" /></div>
					<div className="friend-pseudo">{user.pseudo}</div>
					<img className="add-button" src={addButton} alt="add" onClick={() => sendFriend(user.login)} />
				</div>
			))}
		</div>
	);

}

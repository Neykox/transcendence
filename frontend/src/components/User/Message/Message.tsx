import './Message.scss';
import NavBar from "../../NavBar/NavBar";
import FriendListMessage from './FriendListMessage/FriendListMessage';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';

function randomName() {
	const maleNames = ["James", "John", "Robert", "Michael", "William", "David", "Richard", "Joseph", "Thomas", "Charles", "Christopher", "Daniel", "Matthew", "Donald", "Anthony", "Mark", "Paul", "Steven", "George", "Kenneth"];
	const femaleNames = ["Mary", "Patricia", "Linda", "Barbara", "Elizabeth", "Jennifer", "Maria", "Susan", "Margaret", "Dorothy", "Lisa", "Nancy", "Karen", "Betty", "Helen", "Sandra", "Donna", "Carol", "Ruth", "Sharon"];
	const allNames = [...maleNames, ...femaleNames];

	const randomIndex = Math.floor(Math.random() * allNames.length);
	return allNames[randomIndex];
}

function Message() {
	interface Friends {
		id: number;
		name: string;
		status: string;
	}

	const [friends, setFriends] = useState<Friends[]>([
		{id: 1, name: "Jean", status: "online"},
		{id: 2, name: "Mathilde", status: "online"},
		{id: 3, name: "Steven", status: "offline"},
		{id: 4, name: "Ethan", status: "online"},
		{id: 5, name: "Marion", status: "offline"},
	]);

	return (
		<div className="message">
			<NavBar />
			<div className="content">
				<FriendListMessage friends={friends} />
				<Outlet></Outlet>
			</div>
		</div>
	);
}

export default Message;
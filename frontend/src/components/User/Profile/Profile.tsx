import './Profile.scss';
import NavBar from '../../NavBar/NavBar';
import History from './History/History';
import { useState, useEffect } from 'react';
import PlayerInfo from './PlayerInfo/PlayerInfo';
import FriendList from './FriendList/FriendList';
import { socket } from '../../Socket/socketInit'
import { toast } from 'react-toastify';
import accept from '../../../asset/images/checkmark-circle.svg';
import decline from '../../../asset/images/close-circle.svg';
import Modal from 'react-modal';
import AddFriend from './AddFriend/AddFriend';

// import io from 'socket.io-client';

// Se connecter au canal de websocket
// const socket = io('http://+'process.env.REACT_APP_POSTURL'+:5000/users');

function randomName() {
	const maleNames = ["James", "John", "Robert", "Michael", "William", "David", "Richard", "Joseph", "Thomas", "Charles", "Christopher", "Daniel", "Matthew", "Donald", "Anthony", "Mark", "Paul", "Steven", "George", "Kenneth"];
	const femaleNames = ["Mary", "Patricia", "Linda", "Barbara", "Elizabeth", "Jennifer", "Maria", "Susan", "Margaret", "Dorothy", "Lisa", "Nancy", "Karen", "Betty", "Helen", "Sandra", "Donna", "Carol", "Ruth", "Sharon"];
	const allNames = [...maleNames, ...femaleNames];

	const randomIndex = Math.floor(Math.random() * allNames.length);
	return allNames[randomIndex];
}

function Profile() {

	// Set les wins et loses avec la db;
	const [wins, setWins] = useState(0);
	const [loses, setLoses] = useState(0);
	const [isModalOpen, setIsModalOpen] = useState(false);

	const handleModalOpen = () => {
		setIsModalOpen(true);
	};

	const handleModalClose = () => {
		setIsModalOpen(false);
	};
	//const { user } = useContext(UserContext);

	interface Match {
		id: number;
		opponent: string;
		scores: string;
		result: string;
	}

	interface Friends {
		id: number;
		login: string;
		username: string;
		status: string;
	}

	const [matchs, setMatch] = useState<Match[]>([]);

	const [friends, setFriends] = useState<Friends[]>([]);
	const [requests, setRequests] = useState<Request[]>([]);


	// Écouter les événements de mise à jour
	// socket.on('update', data => {
	// 	// Mettre à jour l'état de l'application avec les nouvelles données
	// 	const fetchUsers = async (): Promise<Friends[]> => {
	// 		const dataa = data.json();
	// 		const friendsData: Friends[] = dataa.map((user: any) => ({
	// 			id: user.id,
	// 			pseudo: user.pseudo,
	// 			status: user.status,
	// 		}));
	// 		return friendsData;
	// 	};

	// 	const getUsers = async () => {
	// 		const fetchedUsers = await fetchUsers();
	// 		setFriends(fetchedUsers);
	// 	};

	// 	getUsers();
	// });

	useEffect(() => {
		// const fetchUsers = async (): Promise<Friends[]> => {
		// 	const response = await fetch('http://+'process.env.REACT_APP_POSTURL'+:5000/users');
		// 	const data = await response.json();
		// 	const friendsData: Friends[] = data.map((user: any) => ({
		// 	  id: user.id,
		// 	  pseudo: user.pseudo,
		// 	  status: user.status,
		// 	}));
		// 	return friendsData;
		//   };

		// const getUsers = async () => {
		// 	const fetchedUsers = await fetchUsers();
		// 	setFriends(fetchedUsers);
		// };

		const fetchFriends = async () => {
			const response = await fetch('http://' + process.env.REACT_APP_POSTURL + ':5000/friends', {
				credentials: 'include'
			});
			if (response.status != 200)
				return;
			let data = await response.text();
			if (!data)
				return;
			let friendsData: string[] = data.toString().split(",");
			if (friendsData.length === 0)
				return;
			let friends = friendsData.map((user: any) => ({
				id: user.id,
				login: user.login,
				username: user.username,
				status: "online"
			}));

			setFriends(friends);
		};

		const fetchRequest = async () => {
			const response = await fetch('http://' + process.env.REACT_APP_POSTURL + ':5000/friends/requests', {
				credentials: 'include',
			});
			if (response.status != 200)
				return;
			let data = await response.json();
			if (!data)
				return;
			let requests = data.map((req: any) => ({
				id: req.id,
				from: req.sender,
				to: req.receiver,
			}));

			setRequests(requests);
		};

		fetchFriends();
		fetchRequest();

		const fetchMatchs = async () => {
			const response = await fetch('http://' + process.env.REACT_APP_POSTURL + ':5000/users/history', {
				method: "POST",
				credentials: 'include'
			});
			let data = await response.json();
			// let data = ""
			if (!data)
				return;
			let index = 0;
			let newMatchs: Match[] = [];
			let win = 0;
			let lose = 0;
			while (data[index]) {
				newMatchs.unshift(data[index]);
				// newMatchs.push(data[index]);
				if (data[index].result === "matchLose")
					lose++;
				else
					win++;
				index++;
			}
			setLoses(lose);
			setWins(win);
			setMatch(newMatchs);
		};
		fetchMatchs();
	}, []);

	// const friendsList = () => {
	// 	// const id = new Date().getTime();
	// 	// const pseudo = randomName();
	// 	// const status = Math.random() < 0.5 ? "online" : "offline";
	// 	// const friendsToAdd = { id, pseudo, status };


	// 	// // 1. Copy du state
	// 	// const friendsCopy = [...friends];


	// 	// // 2. Manipuler mon state
	// 	// friendsCopy.unshift(friendsToAdd);

	// 	// 3. Modifier mon state
	// 	let friends = fetchFriends();
	// 	setFriends(friends);
	// };

	const friendAccept = (accept: boolean, id: number) => {
		if (accept)
			fetch('http://' + process.env.REACT_APP_POSTURL + ':5000/friends/accept/' + id, { credentials: 'include', method: 'DELETE' });
		else
			fetch('http://' + process.env.REACT_APP_POSTURL + ':5000/friends/decline/' + id, { credentials: 'include', method: 'DELETE' });
	}

	const Test = () => { socket.emit('testreq') }
	socket.on('receiveFriend', (data) => toast.info(({ closeToast }) =>
		<div>
			<div>
				{data.from} wants to be your friend !
			</div>
			<div>
				<a onClick={() => { friendAccept(true, data.id) }}><img src={accept} className="friendAccept friendIcon" /></a>
				<a onClick={() => { friendAccept(false, data.id) }}><img src={decline} className="friendRefuse friendIcon" /></a>
			</div>
		</div>, { autoClose: 5000, toastId: "stopdup" }
	)
	)
	return (
		<div>
			<NavBar />
			<div className="profile">
				<PlayerInfo wins={wins} loses={loses} />
				<div className="grid">
				<History matchs={matchs} />
					<FriendList friends={friends} requests={requests} onClick={handleModalOpen} />
				</div>
				<div>
					<Modal isOpen={isModalOpen} >
						<h1> Add friend </h1>
						<AddFriend />
						<button onClick={() => handleModalClose()} className='closeModal'>Close</button>
					</Modal>
				</div>
			</div>
			<button onClick={Test} />
		</div>
	);
}

export default Profile;

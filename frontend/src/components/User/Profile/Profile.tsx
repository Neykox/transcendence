import './Profile.scss';
import NavBar from '../../NavBar/NavBar';
import History from './History/History';
import { useState, useEffect } from 'react';
import PlayerInfo from './PlayerInfo/PlayerInfo';
import FriendList from './FriendList/FriendList';

// import io from 'socket.io-client';

// Se connecter au canal de websocket
// const socket = io('http://localhost:5000/users');

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
	//const { user } = useContext(UserContext);

	interface Match {
		id: number;
		opponent: string;
		scores: string;
		result: string;
	}

	interface Friends {
		id: number;
		pseudo: string;
		status: string;
	}

	const [matchs, setMatch] = useState<Match[]>([]);

	const [friends, setFriends] = useState<Friends[]>([]);


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
		const fetchUsers = async (): Promise<Friends[]> => {
			const response = await fetch('http://localhost:5000/users');
			const data = await response.json();
			const friendsData: Friends[] = data.map((user: any) => ({
			  id: user.id,
			  pseudo: user.pseudo,
			  status: user.status,
			}));
			return friendsData;
		  };

		const getUsers = async () => {
			const fetchedUsers = await fetchUsers();
			setFriends(fetchedUsers);
		};

		getUsers();

		const fetchMatchs = async () => {
			const response = await fetch('http://localhost:5000/users/history', {
				method: "POST",
				credentials: 'include'
			});
			let data = await response.json();
			if (!data)
				return ;
			let index = 0;
			let newMatchs: Match[] = [];
			let win = 0;
			let lose = 0;
			while (data[index])
			{
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

	const friendsList = () => {
		const id = new Date().getTime();
		const pseudo = randomName();
		const status = Math.random() < 0.5 ? "online" : "offline";
		const friendsToAdd = { id, pseudo, status };

		// 1. Copy du state
		const friendsCopy = [...friends];


		// 2. Manipuler mon state
		friendsCopy.unshift(friendsToAdd);

		// 3. Modifier mon state
		setFriends(friendsCopy);
	};

	const get_user = async () => {
    const response = await fetch(
      `http://localhost:5000/users/aleroy`
    );
    if (response.status === 404) {
      return null;
    } else {
      return response.json();
    }
  };

	return (
		<div>
			<NavBar />
			<div className="profile">
				<PlayerInfo wins={wins} loses={loses}/>
				<div className="grid">
					<History matchs={matchs}/>
					<FriendList friends={friends} onClick={friendsList} />
				</div>
			</div>
		</div>
	);
}

export default Profile;
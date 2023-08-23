import { React, useState, useContext } from 'react'
import Pong from './Pong'
import DoubleBall from './DoubleBall'
import { socket } from '../Socket/socketInit';
import UserContext from '../../model/userContext';
import './Lobby.scss'
import { useLocation, useNavigate } from 'react-router-dom';

import accept from '../../asset/images/checkmark-circle.svg';
import decline from '../../asset/images/close-circle.svg';

function Lobby() {
	const navigate = useNavigate();
	const location = useLocation()
	const private_room = location.state ? location.state.private_room : undefined;
	const private_gamemode: string = location.state ? location.state.gametype : "1v1";

	const { user } = useContext(UserContext);

	const [color, setColor] = useState("white");
	const colors = ["red", "lightgreen", "skyblue", "pink", "orange", "purple"];

	const [gamemode, setGamemode] = useState(private_room ? "private" : "select");

	const [paddle1, setPaddle1] = useState({});
	const [paddle2, setPaddle2] = useState({});

	const [ball, setBall] = useState({});
	const [ball2, setBall2] = useState({});

	const [maxScore, setMaxScore] = useState(0);

	socket.on('1v1', (data) => {
		setPaddle1(data.paddle1);
		setPaddle2(data.paddle2);
		setBall(data.ball);
		setMaxScore(data.max_score);
		setGamemode("1v1");
	} )

	socket.on('2balls', (data) => {
		setPaddle1(data.paddle1);
		setPaddle2(data.paddle2);
		setBall(data.ball);
		setBall2(data.ball2);
		setMaxScore(data.max_score);
		setGamemode("2balls");
	} )

	const matchmaking = async () => {
		setGamemode("matchmaking");
		socket.emit("join_list", {pseudo: user.pseudo, color: color, gametype: "1v1"});
	}

	const matchmaking_2balls = async () => {
		setGamemode("matchmaking");
		socket.emit("join_list", {pseudo: user.pseudo, color: color, gametype: "2balls"});
	}

	const private_match = async () => {
		setGamemode("matchmaking");
		socket.emit("private_match", {pseudo: user.pseudo, color: color, gametype: private_gamemode, room: private_room});
	}

	const listItems = colors.map((colory) =>
		<button className="square" style={{ background: colory, border: "2px solid black", "box-shadow": colory + " 0px 5px 15px",}} onClick={() => {setColor(colory);}}></button>
	);

	const toLobby = () => {setGamemode("select")};

	const _1v1 = <Pong paddle1={paddle1} paddle2={paddle2} newBall={ball} max_score={maxScore} toLobby={toLobby}/>;
	const _2balls = <DoubleBall paddle1={paddle1} paddle2={paddle2} newBall={ball} newBall2={ball2} max_score={maxScore} toLobby={toLobby}/>;



	// interface Invite {
	// 	id: number;
	// 	challenger: string;
	// 	time: string;
	// 	gametype: string;
	// }

	// const invites: Invite[] = [
	// 	{id: 1, challenger: "orca", gametype: "1v1"},
	// 	{id: 2, challenger: "zelda", gametype: "1v1"},
	// 	{id: 3, challenger: "link", gametype: "2balls"},
	// 	{id: 4, challenger: "link", gametype: "2balls"},
	// 	{id: 5, challenger: "link", gametype: "2balls"},
	// ];

	// const send_answer = async (answer: boolean, challenger: string, time: string, gametype: string) => {
	// 	socket.emit("send_answer", { "challenger": challenger, "time": time, "answer": answer, "gametype": gametype });
	// 	if (answer === true)
	// 		navigate('/lobby', {state: { "private_room": challenger + time, "gametype": gametype }});
	// 	else
	// 		toast("Match was declined");
	// }

	// const listInvite = invites.map((invite) =>
	// 	<div className="invite">
	// 		<div >{invite.challenger} challenged you to a {invite.gametype === "1v1" ? "Classic" : "2 Balls"} duel!
	// 		<a onClick={() => {send_answer(true, invite.challenger, invite.time, invite.gametype)}}><img src={accept} className="friendAccept friendIcon"/></a>
	// 		<a onClick={() => {send_answer(false, invite.challenger, invite.time, invite.gametype)}}><img src={decline} className="friendRefuse friendIcon"/></a>
	// 		</div>
	// 	</div>
	// );

	return (
		<>
			{gamemode === "select"
			?	<div className="menu">
					<div className="colors">Select your paddle's color
						<div>{listItems}</div>
						<div className="currentColor">Current color: {<button className="square" style={{ background: color, "border-radius": "10px", border: "2px solid black", "box-shadow": color + " 0px 5px 15px",}}></button>}</div>
					</div>
					<div className="gamemodes">Available gamemodes
						<div className="queues">
							<button className="queue" type="button" onClick={matchmaking}>Classic</button>
							<button className="queue" type="button" onClick={matchmaking_2balls}>2 Balls</button>
						</div>
					</div>
					{/*<div className="invites">Duel invites
						<div>{listInvite}</div>
					</div>*/}
					<button className="homeButton" type="button" onClick={() => {navigate('../profile')}}>Home</button>
				</div>
			: <></>}
			{gamemode === "matchmaking"
			?	<div className="menu">
					<div className="gamemodes">Waiting for opponents</div>
				</div>
			: <></>}
			{gamemode === "1v1" ? _1v1 : <></>}
			{gamemode === "2balls" ? _2balls : <></>}
			{gamemode === "private"
			?	<div className="menu">
					<div className="colors">Select your paddle's color
						<div>{listItems}</div>
						<div className="currentColor">Current color: {<button className="square" style={{ background: color, "border-radius": "10px", border: "2px solid black", "box-shadow": color + " 0px 5px 15px",}}></button>}</div>
					</div>
					<div className="gamemodes">
						<button className="queue" type="button" onClick={private_match}>Ready</button>
					</div>
				</div>
			: <></>}
		</>
	)
}
 
export default Lobby










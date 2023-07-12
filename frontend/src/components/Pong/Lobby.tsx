// import { React, useState, useEffect, useContext } from 'react'
// import gif from '../../asset/images/search.gif';
// import Pong from './Pong'
// import { socket } from '../Socket/socketInit';
// import UserContext from '../../model/userContext';

// function Game() {

// 	const { user } = useContext(UserContext);

// 	const [matched, setMatched] = useState(false);
// 	const [paddle1, setPaddle1] = useState({});
// 	const [paddle2, setPaddle2] = useState({});
// 	const [ball, setBall] = useState({});
// 	const [maxScore, setMaxScore] = useState(0);

// 	socket.on('matched', (data) => {
// 		// console.log(data)
// 		setPaddle1(data.paddle1);
// 		setPaddle2(data.paddle2);
// 		setBall(data.ball);
// 		setMaxScore(data.max_score);
// 		setMatched(true);
// 	} )

// 	useEffect(() => {

// 		function matchmaking()
// 		{
// 			socket.emit("join_list", user.pseudo);
// 		}

// 		matchmaking();
// 	}, [user])


// 	return (
// 		<>
// 			{
// 				matched
// 				? <Pong paddle1={paddle1} paddle2={paddle2} newBall={ball} max_score={maxScore}/>
// 				: <img src={gif} alt="searching for opponents..." />
// 			}
// 		</>
// 	)
// }
 
// export default Game

import { React, useState, useContext } from 'react'
import Pong from './Pong'
import { socket } from '../Socket/socketInit';
import UserContext from '../../model/userContext';
import './Lobby.scss'

function Lobby() {

	const { user } = useContext(UserContext);

	const [color, setColor] = useState("white");
	const colors = ["red", "lightgreen", "skyblue", "pink", "orange", "purple"];

	const [gamemode, setGamemode] = useState("select");

	const [paddle1, setPaddle1] = useState({});
	const [paddle2, setPaddle2] = useState({});
	const [paddle3, setPaddle3] = useState({});
	const [paddle4, setPaddle4] = useState({});

	const [ball, setBall] = useState({});
	const [ball2, setBall2] = useState({});

	const [maxScore, setMaxScore] = useState(0);

	socket.on('matched', (data) => {
		// console.log(data)
		setPaddle1(data.paddle1);
		setPaddle2(data.paddle2);
		setBall(data.ball);
		setMaxScore(data.max_score);
		setGamemode("1v1");
	} )

	const matchmaking = async () => {
		setGamemode("gif");
		socket.emit("join_list", {pseudo: user.pseudo, color: color});
	}

	const listItems = colors.map((colory) =>
		<button className="square" style={{ background: colory, border: "2px solid black", "box-shadow": colory + " 0px 5px 15px",}} onClick={() => {setColor(colory);}}></button>
	);

	const _1v1 = <Pong paddle1={paddle1} paddle2={paddle2} newBall={ball} max_score={maxScore}/>;
	// const _1v3 = <Pong4 paddle1={paddle1} paddle2={paddle2} paddle3={paddle3} paddle4={paddle4} newBall={ball} max_score={maxScore}/>;
	// const _2balls = <DoubleBall paddle1={paddle1} paddle2={paddle2} newBall={ball} newBall2={ball2} max_score={maxScore}/>;

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
							<button className="queue" type="button" onClick={matchmaking}>1v1 match</button>
							<button className="queue" type="button" onClick={matchmaking}>1v3 match</button>
							<button className="queue" type="button" onClick={matchmaking}>2 Balls</button>
						</div>
					</div>
				</div>
			: <></>}
			{gamemode === "gif"
			?	<div className="menu">
					<div className="gamemodes">Looking for opponents</div>
				</div>
			: <></>}
			{gamemode === "1v1" ? _1v1 : <></>}
			{/*{gamemode === "1v3" ? _1v3 : <></>}
			{gamemode === "2balls" ? _2balls : <></>}*/}
		</>
	)
}
 
export default Lobby










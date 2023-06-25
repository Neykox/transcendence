import { React, useState, useEffect } from 'react'
import gif from '../../asset/images/search.gif';
import Pong from './Pong'
import { Paddle } from '../../shared/interfaces/game.interface'
import { socket } from '../Socket/socketInit';
// import {useNavigate} from 'react-router-dom'
// import io from "socket.io-client";

// const socket = io.connect("http://localhost:5000");

function Game() {

	const [matched, setMatched] = useState(false);
	let paddle: Paddle;

	// const navigate = useNavigate();
	const clickHandler = () => {
		// navigate("/game");
		setMatched(true);

	}

	useEffect(() => {

		function matchmaking()
		{
			socket.emit("join_list");

			socket.on('matched', (data) => {
				// console.log(data);
				paddle.current = data;
				setMatched(true);
			} )
		}

		matchmaking();
	}, [paddle])

	return (
		<>
			{
				matched
				? <Pong paddle/>
				: <img src={gif} alt="searching for opponents..." />
			}
			<button onClick={clickHandler}>Go game</button>
		</>
	)
}
 
export default Game
import { React, useState, useEffect } from 'react'
import gif from '../../asset/images/search.gif';
import Pong from './Pong'
import { socket } from '../Socket/socketInit';

function Game() {

	const [matched, setMatched] = useState(false);
	const [paddle, setPaddle] = useState({});

	socket.on('matched', (data) => {
		setPaddle(data);
		setMatched(true);
	} )

	useEffect(() => {

		function matchmaking()
		{
			socket.emit("join_list");
		}

		matchmaking();
	}, [])


	return (
		<>
			{
				matched
				? <Pong paddle={paddle}/>
				: <img src={gif} alt="searching for opponents..." />
			}
		</>
	)
}
 
export default Game
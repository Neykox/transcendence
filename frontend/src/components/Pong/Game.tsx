import { React, useState, useEffect } from 'react'
import gif from '../../asset/images/search.gif';
import Pong from './Pong'
import { socket } from '../Socket/socketInit';

function Game() {

	const [matched, setMatched] = useState(false);
	const [paddle1, setPaddle1] = useState({});
	const [paddle2, setPaddle2] = useState({});
	const [ball, setBall] = useState({});
	const [toile, setToile] = useState({});

	socket.on('matched', (data) => {
		console.log(data)
		setPaddle1(data.paddle1);
		setPaddle2(data.paddle2);
		setBall(data.ball);
		setToile(data.toile);
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
				? <Pong newToile={toile} paddle1={paddle1} paddle2={paddle2} newBall={ball}/>
				: <img src={gif} alt="searching for opponents..." />
			}
		</>
	)
}
 
export default Game
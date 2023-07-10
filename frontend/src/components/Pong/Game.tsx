import { React, useState, useEffect, useContext } from 'react'
import gif from '../../asset/images/search.gif';
import Pong from './Pong'
import { socket } from '../Socket/socketInit';
import UserContext from '../../model/userContext';

function Game() {

	const { user } = useContext(UserContext);
	console.log("user = ",user)

	const [matched, setMatched] = useState(false);
	const [paddle1, setPaddle1] = useState({});
	const [paddle2, setPaddle2] = useState({});
	const [ball, setBall] = useState({});
	const [maxScore, setMaxScore] = useState(0);

	socket.on('matched', (data) => {
		// console.log(data)
		setPaddle1(data.paddle1);
		setPaddle2(data.paddle2);
		setBall(data.ball);
		setMaxScore(data.max_score);
		setMatched(true);
	} )

	useEffect(() => {

		function matchmaking()
		{
			socket.emit("join_list", user.pseudo);
		}

		matchmaking();
	}, [user])


	return (
		<>
			{
				matched
				? <Pong paddle1={paddle1} paddle2={paddle2} newBall={ball} max_score={maxScore}/>
				: <img src={gif} alt="searching for opponents..." />
			}
		</>
	)
}
 
export default Game
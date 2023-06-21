import { React, useState } from 'react'
import gif from '../../asset/images/search.gif';
import Pong from './Pong'
import io from "socket.io-client";

const socket = io.connect("http://localhost:5000");

function Game() {

	const [matched, setMatched] = useState(false);
	// const handleKeyDown = event => {
	// 	event.preventDefault();
	// 	if (event.keyCode === 38)//up
	// 	{
	// 		// up.current = true;
	// 		// down.current = false;
	// 		p1.dir = -1;
	// 		sendMessage();
	// 		// p1.y -= p1.dy
	// 	}
	// 	if (event.keyCode === 40)//down
	// 	{
	// 		// up.current = false;
	// 		// down.current = true;
	// 		// p1.y += p1.dy
	// 		p1.dir = 1;
	// 		sendMessage();
	// 	}
	// };

	return (
		<>
			{
				matched
				? <img src={gif} alt="searching for opponents..." />
				: <Pong socket/>
			}
		</>
	)
}
 
export default Game
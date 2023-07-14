import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { socket } from '../Socket/socketInit';
import './DuelButton.scss'

import UserContext from '../../model/userContext';

function DuelButton() {

	const [show, setShow] = useState(false);
	const { user } = useContext(UserContext);
	// const [gametype, setGametype] = useState("1v1");
	const [status, setStatus] = useState("setting-up");//empty de base et give status "setting-up" via props if wanna duel?
	let private_gamemode: string = "1v1";
	let challenger: string = "";

	const sendInvite = async () => {
		setStatus("waitingForAnswer");
		socket.emit("send_invite", { "challenger": user.login, "gametype": private_gamemode });
	}

	socket.on('invite_received', (data) => {
		// console.log(data)
		challenger = data.challenger;
		private_gamemode = data.gamemode;
		setStatus("invite_received");
	} )

	const send_answer = async (status: boolean) => {
		setStatus(status ? "accepted" : "declined");
		socket.emit("send_answer", { "challenger": challenger, "answer": status });
	}

	socket.on('answer_received', (data) => {
		// console.log(data)
		setStatus(data.answer);
	} )

	return (
		<>
			<button className="" type="button" onClick={() => {setShow(!show)}}>DUEL</button>
			{show === true
			? <>
				{status === "setting-up"
					? <div>
						<div className="gamemodes">Available gamemodes
							<div className="queues">
								<button className="queue" type="button" onClick={() => {private_gamemode = "1v1";}}>Classic</button>
								<button className="queue" type="button" onClick={() => {private_gamemode = "2balls";}}>2 Balls</button>
							</div>
							<button className="queue" type="button" onClick={sendInvite}>Send invite</button>
						</div>
					</div>
					: <></>}
					{status === "waitingForAnswer" ? <div>Waiting for answer</div> : <></>}
					{status === "accepted" ? <Link to={"/lobby"} state={{ "challenger": user.login, "gametype": private_gamemode }}>Go to the lobby</Link> : <></>}
					{status === "declined" ? <div>Match was declined</div> : <></>}
					{status === "invite_received"
					? <div>
						<div className="gamemodes">{challenger} challenged you to a {private_gamemode === "1v1" ? "Classic" : "2 Balls"} duel!
							<div className="queues">
								<button className="queue" type="button" onClick={send_answer(true)}>Accept</button>
								<button className="queue" type="button" onClick={send_answer(false)}>Decline</button>
							</div>
						</div>
					</div>
					: <></>}
				</>
			: <></>}
		</>
	)
}

export default DuelButton;

//use alert instead of div
//force redirect if accepted? or just show a little notif waiting to be accepted?
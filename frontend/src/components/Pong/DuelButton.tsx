import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { toast } from "react-toastify";
import { socket } from '../Socket/socketInit';
import './DuelButton.scss'

import UserContext from '../../model/userContext';

function DuelButton() {

	const [show, setShow] = useState(false);
	const { user } = useContext(UserContext);
	const [gametype, setGametype] = useState("1v1");
	const [status, setStatus] = useState("setting-up");
	let challenger: string = "";

	const sendInvite = async () => {
		setStatus("waitingForAnswer");
		socket.emit("send_invite", { "challenger": user.login, "gamemode": gametype });
	}

	socket.on('invite_received', (data) => {
		console.log(data)
		challenger = data.challenger;
		setGametype(data.gamemode);
		setShow(true);
		setStatus("invite_received");
	} )

	const send_answer = async (status: boolean) => {
		setStatus(status ? "accepted" : "declined");
		socket.emit("send_answer", { "challenger": challenger, "answer": status });
		// setStatus("setting-up");
		// setShow(false);
	}

	socket.on('answer_received', (data) => {
		// console.log(data)
		setStatus(data.answer);
		// if (data.answer === "accepted")
		// 	toast(({ closeToast }) => <Link to={"/lobby"} state={{ "challenger": user.login, "gametype": private_gamemode }}>Go to the lobby</Link>)
		// else
		// 	toast(({ closeToast }) => <div>Match was declined</div>)
		// setStatus("setting-up");
		// setShow(false);
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
								<button className="queue" type="button" onClick={() => {setGametype("1v1");}}>Classic</button>
								<button className="queue" type="button" onClick={() => {setGametype("2balls");}}>2 Balls</button>
							</div>
							<button className="queue" type="button" onClick={sendInvite}>Send invite</button>
						</div>
					</div>
					: <></>}
					{status === "waitingForAnswer" ? <div>Waiting for answer</div> : <></>}
					{status === "accepted" ? toast(({ closeToast }) => <Link to={"/lobby"} state={{ "challenger": user.login, "gametype": gametype }}>Go to the lobby</Link>, { autoClose: false }) : <></>}
					{status === "declined" ? toast(({ closeToast }) => <div>Match was declined</div>, { autoClose: false }) : <></>}
					{status === "invite_received"
					? <div>
						<div className="gamemodes">{challenger} challenged you to a {gametype === "1v1" ? "Classic" : "2 Balls"} duel!
							<div className="queues">
								<button className="queue" type="button" onClick={() => {send_answer(true)}}>Accept</button>
								<button className="queue" type="button" onClick={() => {send_answer(false)}}>Decline</button>
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
//swich instead of 2000 ternaries???(could cleanup lobby too)
//use alert instead of div
//force redirect if accepted? or just show a little notif waiting to be accepted?
//challenger name + time to avoid dup
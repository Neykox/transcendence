import { useState, useContext } from 'react';
// import { Link } from 'react-router-dom';
import { toast } from "react-toastify";
import { socket } from '../Socket/socketInit';
import { useNavigate } from "react-router-dom";
// import './DuelButton.scss'

import UserContext from '../../model/userContext';

function DuelButton() {

	const navigate = useNavigate();
	const [show, setShow] = useState(false);
	const { user } = useContext(UserContext);
	let gametype:string = "1v1";
	const [status, setStatus] = useState("setting-up");
	let challenger: string = "";

	const sendInvite = async () => {
		setStatus("waitingForAnswer");
		socket.emit("send_invite", { "challenger": user.login, "gamemode": gametype });
	}

	socket.on('invite_received', (data) => {
		challenger = data.challenger;
		gametype = data.gamemode;
		toast(({ closeToast }) => <div>
									<div >{challenger} challenged you to a {gametype === "1v1" ? "Classic" : "2 Balls"} duel!
										<div >
											<button type="button" onClick={() => {send_answer(true)}}>Accept</button>
											<button type="button" onClick={() => {send_answer(false)}}>Decline</button>
										</div>
									</div>
								</div>, { autoClose: false, toastId: 'dup', closeButton: false, closeOnClick: false,})
	} )

	const send_answer = async (answer: boolean) => {
		toast.dismiss("dup");
		socket.emit("send_answer", { "challenger": challenger, "answer": answer });
		if (answer === true)
			navigate('/lobby', {state: { "challenger": user.login, "gametype": gametype }});
		else
			toast("Match was declined");
	}

	socket.on('answer_received', (data) => {
		setStatus("setting-up");
		setShow(false);
		if (data.answer === "accepted")
			navigate('/lobby', {state: { "challenger": user.login, "gametype": gametype }});
		else
			toast("Match was declined", {toastId: 'success1'});
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
								<button className="queue" type="button" onClick={() => {gametype = "1v1";}}>Classic</button>
								<button className="queue" type="button" onClick={() => {gametype = "2balls";}}>2 Balls</button>
							</div>
							<button className="queue" type="button" onClick={sendInvite}>Send invite</button>
						</div>
					</div>
					: <div>Waiting for answer</div> }
				</>
			: <></>}
		</>
	)
}

export default DuelButton;
//swich instead of 2000 ternaries???(could cleanup lobby too)
//challenger name + time to avoid dup
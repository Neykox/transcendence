import { useState, useContext, useCallback, useEffect, useRef } from 'react';
import { toast } from "react-toastify";
import { socket } from '../Socket/socketInit';
import { useNavigate } from "react-router-dom";
import duel from "../../asset/images/duel.svg"
import './DuelButton.scss'
import accept from '../../asset/images/checkmark-circle.svg';
import decline from '../../asset/images/close-circle.svg';
import UserContext from '../../model/userContext';

function DuelButton(login) {

	const navigate = useNavigate();
	const [show, setShow] = useState(false);
	const { user } = useContext(UserContext);
	let gametype:string = useRef("1v1");
	const [status, setStatus] = useState("setting-up");
	let challenger: string = useRef("");
	const today = new Date();
	let time:string = useRef("");

	const sendInvite = async () => {
		setStatus("waitingForAnswer");
		console.log(login.login);
		time.current = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
		socket.emit("send_invite", { "challenger": user.login, "time": time.current, "gamemode": gametype.current, "challenged": login.login });
	}

	const myEventHandler2 = useCallback(data => {
		const send_answer = async (answer: boolean) => {
			toast.dismiss("dup");
			socket.emit("send_answer", { "challenger": challenger.current, "time": time.current, "answer": answer, "gametype": gametype.current });
			if (answer === true)
				navigate('/lobby', {state: { "private_room": challenger.current + time.current, "gametype": gametype.current }});
			else
				toast("Match was declined", {toastId: 'matchDeclined'});
		}
		if( toast.isActive("dup"))
			send_answer(false);
		challenger.current = data.challenger;
		gametype.current = data.gamemode;
		time.current = data.time;

		toast(({ closeToast }) => <div>
									<div >{challenger.current} challenged you to a {gametype.current === "1v1" ? "Classic" : "2 Balls"} duel!
										<div >
											<a onClick={() => {send_answer(true)}}><img src={accept} className="friendAccept friendIcon"/></a>
											<a onClick={() => {send_answer(false)}}><img src={decline} className="friendRefuse friendIcon"/></a>
										</div>
									</div>
								</div>, { autoClose: false, toastId: 'dup', closeButton: false, closeOnClick: false,})
	}, [navigate]);

	useEffect(() => {
		socket.on('invite_received', myEventHandler2);
		return () => socket.off('invite_received', myEventHandler2);
	}, [myEventHandler2]);

	const myEventHandler = useCallback(data => {
		setStatus("setting-up");
		setShow(false);
		if (data.answer === "accepted")
			navigate('/lobby', {state: { "private_room": data.challenger + data.time, "gametype": data.gametype }});
		else
			toast("Match was declined", {toastId: 'matchDeclined'});
	}, [navigate, user.login]);

	useEffect(() => {
	  socket.on('answer_received', myEventHandler);
	  return () => socket.off('answer_received', myEventHandler);
	}, [myEventHandler]);

	return (
		<>
			<div className='svg'>
				<a onClick={() => {setShow(!show)}}>
					<img className="" src={duel}/></a></div>
			{show === true
			? <>
				{status === "setting-up"
					? <div className="duelGamemodes" style={{ color: 'white' }}>Available gamemodes
						<button className="duelQueue" type="button" onClick={() => {gametype.current = "1v1";}}>Classic</button>
						<button className="duelQueue" type="button" onClick={() => {gametype.current = "2balls";}}>2 Balls</button>
						<button className="duelQueue" type="button" onClick={sendInvite}>Send invite</button>
					</div>
					: <div>Waiting for answer</div> }
				</>
			: <></>}
		</>
	)
}

export default DuelButton;

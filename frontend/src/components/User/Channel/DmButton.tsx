import { useContext, useCallback, useEffect } from 'react';
import { toast } from "react-toastify";
import { socket } from '../../Socket/socketInit';
import { useNavigate } from "react-router-dom";
import dm from "../../../asset/images/dm.svg"
import UserContext from '../../../model/userContext';

function DmButton(login) {

	const navigate = useNavigate();
	const { user } = useContext(UserContext);


	const myEventHandler = useCallback(data => {
		toast(({ closeToast }) =>	<div>{data.user_login} slid in your dms
										<div >
											<a onClick={() => {navigate(`/channel/${data.chan.name}`, {state: { "channel": data.chan, }});}}>Join</a>
										</div>
									</div>, { toastId: 'dm_warning', autoClose: 6000, theme: "dark", })
	}, [navigate, ]);

	useEffect(() => {
	  socket.on('dm_invite', myEventHandler);
	  return () => socket.off('dm_invite', myEventHandler);
	}, [myEventHandler]);



	const findChannel = async (channel) => {
		const response = await fetch('http://localhost:5000/channels/channel_by_name',
			{
				method: "POST",
				headers: { 'Content-Type': 'application/json' },
				credentials: 'include',
				body: JSON.stringify({name: channel}),
			});
		if (response.status === 403)
			return null;
		return await response.json();
	};

	const createChannel = async (newChannel) => {
		const response = await fetch('http://localhost:5000/channels/create',
			{
				method: "POST",
				headers: { 'Content-Type': 'application/json' },
				credentials: 'include',
				body: JSON.stringify(newChannel),
			});
		return await response.json();
	};

	async function joinChan() {
		let chan = await findChannel(login.login+"-"+user.login);
		if (chan === null)
			chan = await findChannel(user.login+"-"+login.login);
		if (chan === null)
			chan = await createChannel({ owner: user.login, name: user.login+"-"+login.login, type: 'dm', dm: login.login });
		if (chan.type !== 'dm')
		{
			console.log("log: someone already stole that name i dont fucking know")
			return "i dont fucking know";
		}
		console.log({chan})
		delete(chan.dm)
		delete(chan.users)
		console.log({chan})
		socket.emit("send_dm_invite", { "channel": chan, "user_login": user.login, "target_login": login.login, });
		navigate(`/channel/${chan.name}`, {state: { "channel": chan, }});
	}

	return (
		<>
			<div className='svg'>
				<a onClick={joinChan}> <img className="" src={dm} alt='dm'/>dm</a>
			</div>
		</>
	)
}

export default DmButton;
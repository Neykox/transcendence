import { React, useState, useEffect, useContext, } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';
import { toast } from "react-toastify";
import './TwoFa.scss';
import { useLocation } from 'react-router-dom';
import UserContext from '../../model/userContext';
import { UserInfo } from '../../model/userInfo';

function TwoFactor(){

	const location = useLocation()
	const signin = location.state ? location.state.signin : false;
	const [text, setText] = useState("");
	const [qrcode, setqrcode] = useState("")
	const navigate = useNavigate();
	let { user } = useContext<UserInfo>(UserContext);
	// const userContext = useContext(UserContext);
	// let ball: Ball = useRef(newBall);

	const turnOn = async (e) => {
		e.preventDefault();
		const requestOptions = {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		credentials: 'include',
		body: JSON.stringify({ TwoFaCode: text })
		};

		const response = await fetch('http://' + process.env.REACT_APP_POSTURL + ':5000/two_fa/turn-on', requestOptions);
		if (response.status === 200)
		{
			toast("ok");
			if (signin === true)
				navigate("/profile");
			else
			{
				user = {...user, is2FaActive: true};
				// setUser(prevUser => ({ ...prevUser, is2FaActive: true }));
				localStorage.setItem("user", await JSON.stringify(user));
				navigate("/settings");
			}
		}
		else
			toast("not ok");
	};

	useEffect(() => {
		console.log(signin)

		const getQrCode = async () => {
			const requestOptions = {
			method: 'Get',
			credentials: 'include',
			};
			const response = await fetch('http://' + process.env.REACT_APP_POSTURL + ':5000/two_fa/generate_qrcode', requestOptions);
			const data = await response.json();
			setqrcode(data.otpauthUrl);
		};

		if (signin === false)
			getQrCode();
	}, [signin])

	return (
		<>
			<div className="whole">
				{signin === false ? <div className="qrcode"> <QRCodeCanvas value={qrcode} /> </div> : <></>}
				<div className="form">
					<form onSubmit={turnOn}>
						<label>Enter your 6 digits code: </label>
						<br/>
						<input type="text" value={text} onChange={(e) => setText(e.target.value)} />
						<input type="submit" />
					</form>
				</div>
			</div>
		</>
	)
}

export default TwoFactor;

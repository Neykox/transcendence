// import {React, useState} from 'react'
// import {Link} from 'react-router-dom'
// import {QRCodeCanvas} from 'qrcode.react';

// function Page2(){

// 	const [enabled, setenabled] = useState("disabled");
// 	const [text, setText] = useState("");
// 	const [qrcode, setqrcode] = useState("")

// 	const handleClick = async () => {
// 		const requestOptions = {
// 		method: 'Get',
// 		credentials: 'include',
// 		};
// 		const response = await fetch('http://localhost:5000/two_fa/generate_qrcode', requestOptions);
// 		const data = await response.json();
// 		setqrcode(data.otpauthUrl);
// 		setenabled('generated');
// 	};

// 	const handleClick2 = async () => {
// 		const requestOptions = {
// 		method: 'POST',
// 		headers: { 'Content-Type': 'application/json' },
// 		credentials: 'include',
// 		body: JSON.stringify({ TwoFaCode: text })
// 		};

// 		await fetch('http://localhost:5000/two_fa/turn-on', requestOptions);
// 		// const data = await response.json();
// 		// console.log(data);
// 		setenabled('enabled');
// 	};

// 	const handleClick3 = async () => {
// 		const requestOptions = {
// 		method: 'POST',
// 		headers: { 'Content-Type': 'application/json' },
// 		credentials: 'include',
// 		body: JSON.stringify({ title: 'React POST Request Example' })
// 		};

// 		await fetch('http://localhost:5000/two_fa/turn-off', requestOptions);
// 		// const data = await response.json();
// 		// console.log({data});
// 		setenabled('disabled');
// 	};

// 	const handleClick4 = async () => {
// 		const requestOptions = {
// 		method: 'POST',
// 		headers: { 'Content-Type': 'application/json' },
// 		credentials: 'include',
// 		body: JSON.stringify({ title: 'React POST Request Example' })
// 		};

// 		await fetch('http://localhost:5000/auth/clear_cookie', requestOptions);
// 		// const data = await response.json();
// 		// console.log({data});
// 	};

// 	return (
// 		<>
// 			<div>page 2</div>
// 			<Link to='/'>Home</Link>
// 			<Link to='/page1'>Page 1</Link>

// 			<div>
// 			  <button type="button" onClick={handleClick}>
// 				generate qrcode
// 			  </button>
// 			  <button type="button" onClick={handleClick2}>
// 				enable
// 			  </button>
// 			  <button type="button" onClick={handleClick3}>
// 				disable
// 			  </button>
// 			  <button type="button" onClick={handleClick4}>
// 				clear cookie
// 			  </button>
// 			</div>
// 			<div>2fa status: {enabled}</div>
// 			{enabled === "generated" && <QRCodeCanvas value={qrcode} />}
// 			<br/>
// 			<input value={text} onChange={(e) => setText(e.target.value)}/>
// 		</>
// 	)
// }

// export default Page2;


import { React, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { QRCodeCanvas } from 'qrcode.react';
import { toast } from "react-toastify";
import './TwoFa.scss';
import { useLocation } from 'react-router-dom';

function TwoFactor(){

	const location = useLocation()
	const signin = location.state ? location.state.signin : false;
	const [text, setText] = useState("");
	const [qrcode, setqrcode] = useState("")
	const navigate = useNavigate();
	// let ball: Ball = useRef(newBall);

	const turnOn = async (e) => {
		e.preventDefault();
		const requestOptions = {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		credentials: 'include',
		body: JSON.stringify({ TwoFaCode: text })
		};

		const response = await fetch('http://localhost:5000/two_fa/turn-on', requestOptions);
		if (response.status === 200)
		{
			toast("ok");
			// if (signin === true)
				navigate("/profile");
		}
		else
			toast("not ok");
	};

	// const turnOff = async () => {
	// 	const requestOptions = {
	// 	method: 'POST',
	// 	headers: { 'Content-Type': 'application/json' },
	// 	credentials: 'include',
	// 	};

	// 	await fetch('http://localhost:5000/two_fa/turn-off', requestOptions);
	// };

	// const clearCookie = async () => {
	// 	const requestOptions = {
	// 	method: 'POST',
	// 	headers: { 'Content-Type': 'application/json' },
	// 	credentials: 'include',
	// 	};

	// 	await fetch('http://localhost:5000/auth/clear_cookie', requestOptions);
	// };

	useEffect(() => {
		console.log(signin)

		const getQrCode = async () => {
			const requestOptions = {
			method: 'Get',
			credentials: 'include',
			};
			const response = await fetch('http://localhost:5000/two_fa/generate_qrcode', requestOptions);
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
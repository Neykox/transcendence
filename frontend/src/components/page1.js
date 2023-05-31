import {React, useState, useEffect} from 'react'
import {useLocation, useNavigate} from 'react-router-dom'


function Page1(){

	// const handleClick = async () => {
	//     const requestOptions = {
	//     method: 'Get',
	//     headers: { 'Content-Type': 'application/json' },
	//     body: JSON.stringify({ UserId: 2 })
	//     };

	//     const response = await fetch('http://localhost:5000/auth/signin', requestOptions);
	//     const data = await response.json();
	//     console.log(data);
	// };

	const [redirect, setRedirect] = useState(false);

	const search = useLocation().search; //if search=NULL need to try to login
	const code = new URLSearchParams(search).get('code'); //if code=NULL access was denied
	let access_token;
	let user_info;

	// const handleClick = () => {
	// 	window.location.href = 'https://api.intra.42.fr/oauth/authorize?client_id=' + process.env.REACT_APP_UID42 + '&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fpage1&response_type=code';
	// };

	const navigate = useNavigate();
	const clickHandler = () => {
		navigate(-1);
	}

	const get_access_token = async () => {
		const requestOptions = {
			method: 'Post',
			headers: {'Content-Type': 'application/json'},
			body:JSON.stringify({
				'grant_type': 'authorization_code',
				'client_id': process.env.REACT_APP_UID42,
				'client_secret': process.env.REACT_APP_SECRET42,
				'code': code,
				'redirect_uri': 'http://localhost:3000/page1',
			})
		};
		const response = await fetch('https://api.intra.42.fr/oauth/token', requestOptions);
		const data = await response.json();
		console.log(data.access_token);
		access_token = data.access_token;
	};

	const get_user_info = async () => {
		const requestOptions = {
			method: 'GET',
			headers: {'Authorization': 'Bearer ' + access_token}
		};
		const response = await fetch('https://api.intra.42.fr/v2/me', requestOptions);
		user_info = await response.json();
		console.log(user_info);
	};

	const get_user = async () => {
		const response = await fetch('http://localhost:5000/users:' + user_info.login);
		const user = await response.json();
		console.log(user);
	};

	useEffect(() => {
		const test = async () =>
		{
			if (code)
			{
				await get_access_token();
				await get_user_info();
				await get_user();
				setRedirect(true);
			}
		}
		test();
	});

	if (redirect){
		navigate("/profile");
	}

	return (
		<>
			<div>page 1</div>
		
			<div>Need to allow access to continue</div>
			<button onClick={clickHandler}>Go back</button>
		</>
	)
}//or just redirect to login page?

export default Page1;

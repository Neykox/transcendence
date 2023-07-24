import React, { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import UserContext from "../model/userContext";
import { get } from "http";

export default function Page1() {
	const [redirect, setRedirect] = useState(false);
	const [direction, setDirection] = useState("");

	const userContext = useContext(UserContext);

	const search = useLocation().search;
	const code = new URLSearchParams(search).get("code");

	const navigate = useNavigate();
	const clickHandler = () => {
		navigate(-1);
	};

	const get_access_token = async () => {
		// const requestOptions = {
		// 	method: "POST",
		// 	headers: { "Content-Type": "application/json" },
		// 	body: JSON.stringify({
		// 		grant_type: "authorization_code",
		// 		client_id: process.env.REACT_APP_UID42,
		// 		client_secret: process.env.REACT_APP_SECRET42,
		// 		// code,
		// 		// redirect_uri: `http://${process.env.REACT_APP_POSTURL}:3000/page1`,
		// 		"access_token":code,
		// 		"token_type":"bearer",
		// 		"expires_in":7200,
		// 		"scope":"public",
		// 		"created_at":Date.now()
		// 	}),
		// };
		// const response = await fetch(
		// 	"https://api.intra.42.fr/oauth/token",
		// 	requestOptions
		// );
		// const data = await response.json();
		// return data.access_token;
	};



	const get_user_info = async () => {
		// const requestOptions = {
		// 	method: "GET",
		// 	headers: { Authorization: `Bearer ${access_token}` },
		// };
		// const response = await fetch(
		// 	"https://api.intra.42.fr/v2/me",
		// 	requestOptions
		// );
		// return response.json();

		const response = await fetch(`http://${process.env.REACT_APP_POSTURL}:5000/auth/${code}`)
		return await response.json();
	};



	const get_user = async (login) => {
		const response = await fetch(
			`http://${process.env.REACT_APP_POSTURL}:5000/users/${login}`
		);
		if (response.status === 404) {
			return null;
		} else {
			return response.json();
		}
	};



	const create_user = async (login, image) => {
		const requestOptions = {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				Login: login,
				Image: image.link,
			}),
		};

		const response = await fetch(
			"http://" + process.env.REACT_APP_POSTURL + ":5000/users/create",
			requestOptions
		);
		return response.json();
	};



  const get_cookie = async (user) => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(user),
    };
    await fetch("http://" + process.env.REACT_APP_POSTURL + ":5000/auth/create_cookie", requestOptions);
  };


	useEffect(() => {
		const test = async () => {
			if (code) {
				// const access_token = await get_access_token();
				const user_info = await get_user_info();
				const user = await get_user(user_info.login);


				if (user === null) {
					// localStorage.removeItem("user");
					await create_user(user_info.login, user_info.image);
					await get_cookie(user);
					const newUser = await get_user(user_info.login);
					userContext.setUser(user_info);
					userContext.setUser(prevUser => ({ ...prevUser, image: user_info.image.link }));
					userContext.setUser(prevUser => ({ ...prevUser, pseudo: user_info.login }));
					const userJSON = JSON.stringify(newUser);
					// Stockage de la chaîne JSON dans le localStorage avec la clé "user"
					localStorage.setItem("user", userJSON);
					setDirection("/profile");
				} else {
					await get_cookie(user);
					const userJSON = JSON.stringify(user);
					localStorage.setItem("user", userJSON);
					userContext.setUser(JSON.parse(userJSON));
					setDirection("/profile");
					if (user.is2FaActive)
						setDirection("/twofa");
				}
				if ( localStorage.getItem("42image") === null) {
					localStorage.setItem("42image", user_info.image.link);
				}
        		setRedirect(true);
			}
		};
    	test();
	}, []);

  useEffect(() => {
    if (redirect) {
      navigate(direction, {state: { signin: true }});
    }
  }, [redirect, direction, navigate]);

	useEffect(() => {
		if (redirect) {
			navigate(direction);
		}
	}, [redirect, direction, navigate]);

	return (
		<>
			<div>page 1</div>
			<div>Need to allow access to continue</div>
			<button onClick={clickHandler}>Go back</button>
		</>
	);
}

import React from 'react'
import {Link, useNavigate} from 'react-router-dom'



function NotFound(){
	const navigate = useNavigate();
	const clickHandler = () => {
		navigate(-1);
	}

	return (
		<>
			<div>404 no page found</div>
			<Link to='/'>Home</Link>
			<button onClick={clickHandler}>Go back</button>
		</>
	)
}

export default NotFound;
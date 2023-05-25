import React from 'react'
import {Link} from 'react-router-dom'
// import {useState} from "react";

function Page1(){

    const handleClick = async () => {
        const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ UserId: 2 })
        };

        const response = await fetch('http://localhost:5000/auth/signin', requestOptions);
        const data = await response.json();
        console.log(data);
    };

    const handleClick2 = async () => {
    	//  fetch('http://localhost:5000/signin', {
        //     method: 'GET',
        //     headers: {'Content-Type': 'application/json'},
        //     body: JSON.stringify({
        //         message
        //     })
        // });
        const response = await fetch('http://localhost:5000/auth/dc');
        const data = await response.json();
        console.log(data);
    };

	return (
		<>
			<div>page 1</div>
			<Link to='/'>Home</Link>
			<Link to='/page2'>Page 2</Link>
			


		
		    <div>
		      <button type="button" onClick={handleClick}>
		        Hi
		      </button>
		      <button type="button" onClick={handleClick2}>
		        Bye
		      </button>
		    </div>
		</>
	)
}

export default Page1;

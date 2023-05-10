import React from 'react'
import {Link} from 'react-router-dom'
// import {useState} from "react";

function Page1(){

    // const [messages, setMessages] = useState([]);
    // const [message, setMessage] = useState('');
    // let allMessages = [];

    // useEffect(() => {
    //     Pusher.logToConsole = true;

    //     const pusher = new Pusher('', {
    //         cluster: ''
    //     });

    //     const channel = pusher.subscribe('chat');
    //     channel.bind('message', function (data) {
    //         allMessages.push(data);
    //         setMessages(allMessages);
    //     });
    // }, []);

	// const submit = async e => {
    //     e.preventDefault();

    //     await fetch('http://localhost:5000/signin', {
    //         method: 'GET',
    //         headers: {'Content-Type': 'application/json'},
    //         body: JSON.stringify({
    //             message
    //         })
    //     });

    //     setMessage(message);
    //     allMessages.push(message);
    //     setMessages(allMessages);
    // }

    const handleClick = async () => {
    	//  fetch('http://localhost:5000/signin', {
        //     method: 'GET',
        //     headers: {'Content-Type': 'application/json'},
        //     body: JSON.stringify({
        //         message
        //     })
        // });
        const response = await fetch('http://localhost:5000/auth/signin');
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

//     async componentDidMount() {
//     // GET request using fetch with async/await
//     const response = await fetch('https://api.npms.io/v2/search?q=react');
//     const data = await response.json();
//     this.setState({ totalReactPackages: data.total })
// }

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
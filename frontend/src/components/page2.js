import {React, useState} from 'react'
import {Link} from 'react-router-dom'

function Page2(){

    const [enabled, setenabled] = useState(0);

    const handleClick = async () => {
    	const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'React POST Request Example' })
		};

        const response = await fetch('http://localhost:5000/users:1', requestOptions);
        const data = await response.json();
        console.log(data);
        setenabled(1);
    };

    const handleClick2 = async () => {
    	const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'React POST Request Example' })
		};

        const response = await fetch('http://localhost:5000/users:1', requestOptions);
        const data = await response.json();
        console.log(data);
        setenabled(0);
    };

	return (
		<>
			<div>page 2</div>
			<Link to='/'>Home</Link>
			<Link to='/page1'>Page 1</Link>

			<div>
		      <button type="button" onClick={handleClick}>
		        enable
		      </button>
		      <button type="button" onClick={handleClick2}>
		        disable
		      </button>
		    </div>
		    <div>2fa status: {enabled ? 'Enabled' : 'Disabled'}</div>
		</>
	)
}

export default Page2;

import {React, useState} from 'react'
import {Link} from 'react-router-dom'
import {QRCodeCanvas} from 'qrcode.react';

function Page2(){

    const [enabled, setenabled] = useState("disabled");
    const [text, setText] = useState("");
    const [qrcode, setqrcode] = useState("")

    const handleClick = async () => {
    	const response = await fetch('http://localhost:5000/two_fa/generate_qrcode');
        const data = await response.json();
        setqrcode(data.otpauthUrl);
        setenabled('generated');
    };

    const handleClick2 = async () => {
    	const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ TwoFaCode: text , UserId: 1})
		};

        const response = await fetch('http://localhost:5000/two_fa/turn-on', requestOptions);
        const data = await response.json();
        console.log(data);
        setenabled('enabled');
    };

    const handleClick3 = async () => {
    	const requestOptions = {
        method: 'POST',
        headers: { "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsInVzZXJuYW1lIjoiYSIsImlhdCI6MTY4NTAyNjUxNCwiZXhwIjoxNjg1MDI2NTc0fQ.UXUZA1gdjeN3jMuJFEznn3ZuzcTVPvKU3ri8Ss7S68M" },
        body: JSON.stringify({ title: 'React POST Request Example' })
		};

        const response = await fetch('http://localhost:5000/two_fa/turn-off', requestOptions);
        const data = await response.json();
        console.log({data});
        setenabled('disabled');
    };

	return (
		<>
			<div>page 2</div>
			<Link to='/'>Home</Link>
			<Link to='/page1'>Page 1</Link>

			<div>
		      <button type="button" onClick={handleClick}>
		        generate qrcode
		      </button>
		      <button type="button" onClick={handleClick2}>
		        enable
		      </button>
		      <button type="button" onClick={handleClick3}>
		        disable
		      </button>
		    </div>
		    <div>2fa status: {enabled}</div>
		    {enabled === "generated" && <QRCodeCanvas value={qrcode} />}
		    <br/>
		    <input value={text} onChange={(e) => setText(e.target.value)}/>
		</>
	)
}

export default Page2;
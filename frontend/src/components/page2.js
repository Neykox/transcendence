import React from 'react'
import {Link} from 'react-router-dom'

function Page2(){
	return (
		<>
			<div>page 2</div>
			<Link to='/'>Home</Link>
			<Link to='/page1'>Page 1</Link>
		</>
	)
}

export default Page2;
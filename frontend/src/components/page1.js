import React from 'react'
import {Link} from 'react-router-dom'

function Page1(){
	return (
		<>
			<div>page 1</div>
			<Link to='/'>Home</Link>
			<Link to='/page2'>Page 2</Link>
		</>
	)
}

export default Page1;
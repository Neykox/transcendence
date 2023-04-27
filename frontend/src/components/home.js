import React from 'react'
import {Link} from 'react-router-dom'



function Home(){
	return (
		<>
			{/*<Routes>
			<Route path='/page1' component={Page1}/>
			<Route path='/page2' component={Page2}/>
			<Navigate to='/home' component={Home}/>
			</Routes>*/}

			<div>Home</div>
			<Link to='/page1'>Page 1</Link>
			<Link to='/page2'>Page 2</Link>
		</>
	)
}

export default Home;
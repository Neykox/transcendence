import './NavBar.scss';
import homePageImg from '../../asset/images/home-page.png';
import messageImg from '../../asset/images/message.png';
import userImg from '../../asset/images/user.png';
import crowdImg from '../../asset/images/crowd.png';
import settings from '../../asset/images/settings_logo.png';
//import paddle from '../../asset/images/pngwing.com.png';
import pingPongImg from '../../asset/images/ping-pong_logo.png';
import shutdown from '../../asset/images/shutdown_logo.png';

import { Link, useNavigate } from 'react-router-dom';
class active {
	static setActive(name: string) {
		active.active = name;
	}

	static active: string;
}

// import UserContext from '../../model/userContext';

function e(){
	const clearCookie = async () => {
		const requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			credentials: 'include',
			body: JSON.stringify({ title: 'React POST Request Example' })
		};
		await fetch('http://' + process.env.REACT_APP_POSTURL + ':5000/auth/clear_cookie', requestOptions);
	};
	clearCookie();
	localStorage.removeItem("user");
	localStorage.removeItem("42image");
}

function NavBar() {

	// const { user } = useContext(UserContext);
	return (
		<nav>
			<div className={active.active === "profile" ? "selectedLink" : ""}>
				<Link to={"/profile"} onClick={() => active.setActive("profile")}>
					<img src={homePageImg} alt="homePage" className="first" />
				</Link>
			</div>
			<div className="line"></div>
			<div className={active.active === "message" ? "selectedLink" : ""}>
				<Link to={"/message"} onClick={() => active.setActive("message")}>
					<img src={messageImg} alt="" />
				</Link>
			</div>
			<div className={active.active === "user" ? "selectedLink" : ""}>
				<Link to={"/message"} onClick={() => active.setActive("message")}>
					<img src={userImg} alt="" />
				</Link>
			</div>
			<div>
				<Link to={"/channel"}>
					<img src={crowdImg} alt="" />
				</Link>
			</div>
			<div className="pong">
				<Link to={"/lobby"} /*state={{ "challenger": "bob" }}*/>
					<img src={pingPongImg} alt="" />
				</Link>
			</div>
			<div className={active.active === "settings" ? "set selectedLink" : "set"}>
				<Link to={"/settings"} onClick={() => active.setActive("settings")}>
					<img src={settings} alt="" />
				</Link>
			</div>
			<div className={active.active === "shutdown" ? "set selectedLink" : "set2"}>
				<Link to={"/"} onClick={async () =>{ await e}} /*clear localstorage/cookie and navigate("/login")*/>
					<img src={shutdown} alt="" />
				</Link>
			</div>

		</nav>
	)
}

export default NavBar;

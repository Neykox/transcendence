import './NavBar.scss';
import homePageImg from '../../asset/images/home-page.png';
// import messageImg from '../../asset/images/message.png';
// import userImg from '../../asset/images/user.png';
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

function NavBar() {

	const navigate = useNavigate();
	async function e() {
		const clearCookie = async () => {
			const requestOptions = {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				credentials: 'include',
				body: JSON.stringify({ title: 'React POST Request Example' })
			};
			await fetch('http://' + process.env.REACT_APP_POSTURL + ':5000/auth/clear_cookie', requestOptions);
		};
		await clearCookie();
		localStorage.removeItem("user");
		localStorage.removeItem("42image");
		navigate('/');
	}

	async function a() {
		navigate('/');
	}
	// const { user } = useContext(UserContext);
	return (
		<nav>
			<div className={active.active === "profile" ? "selectedLink" : ""}>
				<img src={homePageImg} alt="homePage" className="first" onClick={() => a()} />
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
				<img src={shutdown} alt="" onClick={() => e()} />
			</div>

		</nav>
	)
}

export default NavBar;

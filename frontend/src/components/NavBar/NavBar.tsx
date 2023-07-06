import './NavBar.scss';
import homePageImg from '../../asset/images/home-page.png';
import messageImg from '../../asset/images/message.png';
import userImg from '../../asset/images/user.png';
import crowdImg from '../../asset/images/crowd.png';
import settings from '../../asset/images/settings.png';
import { useState } from 'react';
import { Link } from 'react-router-dom';

function NavBar() {
	const [active, setActive] = useState(0);
	
	return (
		<nav>
			<div className={active === "profile" ? "selected" : ""}>
				<Link to={"/profile"} onClick={() => setActive("profile")}>
					<img src={homePageImg} alt="homePage" className="first" />
				</Link>
			</div>
			<div className="line"></div>
			<div className={active === "message" ? "selected" : ""}>
				<Link to={"/message"} onClick={() => setActive("message")}>
					<img src={messageImg} alt="" />
				</Link>
			</div>
			<div className={active === "user" ? "selected" : ""}>
				<Link to={"/message"} onClick={() => setActive("message")}>
					<img src={userImg} alt="" />
				</Link>
			</div>
			<div className={active === "friends" ? "selected" : ""}>
				<Link to={"/message"} onClick={() => setActive("message")}>
					<img src={crowdImg} alt="" />
				</Link>
			</div>
			<div className={active === "settings" ? "set selected" : "set"}>
				<Link to={"/settings"} onClick={() => setActive("settings")}>
					<img src={settings} alt="" />
				</Link>
			</div>
		</nav>
	)
}

export default NavBar;

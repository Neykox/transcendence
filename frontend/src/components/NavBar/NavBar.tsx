import './NavBar.scss';
import homePageImg from '../../asset/images/home-page.png';
import messageImg from '../../asset/images/message.png';
import userImg from '../../asset/images/user.png';
import crowdImg from '../../asset/images/crowd.png';
import settings from '../../asset/images/settings.png';
import { useState } from 'react';
import { Link } from 'react-router-dom';
class active {
	static setActive(name : string) {
		active.active = name;
	}

	static active: string;
}

function NavBar() {

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
			<div className={active.active === "friends" ? "selectedLink" : ""}>
				<Link to={"/message"} onClick={() => active.setActive("message")}>
					<img src={crowdImg} alt="" />
				</Link>
			</div>
			<div className={active.active === "settings" ? "set selectedLink" : "set"}>
				<Link to={"/settings"} onClick={() => active.setActive("settings")}>
					<img src={settings} alt="" />
				</Link>
			</div>
		</nav>
	)
}

export default NavBar;

import './NavBar.scss';
import homePageImg from '../../asset/images/home-page.png';
import messageImg from '../../asset/images/message.png';
import userImg from '../../asset/images/user.png';
import crowdImg from '../../asset/images/crowd.png';
import settings from '../../asset/images/settings.png';
import paddle from '../../asset/images/pngwing.com.png';
import { Link } from 'react-router-dom';

// import UserContext from '../../model/userContext';

function NavBar() {

	// const { user } = useContext(UserContext);

	return (
		<nav>
			<div>
				<Link to={"/profile"}>
					<img src={homePageImg} alt="homePage" className="first" />
				</Link>
			</div>
			<div className="line"></div>
			<div>
				<Link to={"/message"}>
					<img src={messageImg} alt="" />
				</Link>
			</div>
			<div>
				<Link to={"/message"}>
					<img src={userImg} alt="" />
				</Link>
			</div>
			<div>
				<Link to={"/message"}>
					<img src={crowdImg} alt="" />
				</Link>
			</div>
			<div>
				<Link to={"/lobby"} /*state={{ "challenger": "bob" }}*/>
					<img src={paddle} alt="" />
				</Link>
			</div>
			<div className="set">
				<Link to={"/settings"}>
					<img src={settings} alt="" />
				</Link>
			</div>
		</nav>
	)
}

export default NavBar;
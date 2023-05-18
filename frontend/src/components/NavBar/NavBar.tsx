import './NavBar.scss';
import homePageImg from '../../asset/images/home-page.png';
import messageImg from '../../asset/images/message.png';
import userImg from '../../asset/images/user.png';
import crowdImg from '../../asset/images/crowd.png';
import { Link } from 'react-router-dom';

function NavBar() {
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
		</nav>
	)
}

export default NavBar;
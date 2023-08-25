import './FriendList.scss';
import userImg from '../../../../asset/images/user.png';
import { Link } from 'react-router-dom';

import DuelButton from '../../../Pong/DuelButton';
import DmButton from '../../Channel/DmButton';

interface HistoryProps {
	friends: Array<{ owner: string; pseudo: string; status: string; }>;
	onClick: () => void;
}

export default function FriendList({ friends, onClick }: HistoryProps) {

	return (
		<div className="friends">
			<h1>Friends list</h1>
			<div className="allFriends">
				{friends.map((friend: {
					id: number; pseudo: string; status: string;
				}) => (
					<div className="friendsList" key={friend.id}>
						<img src={userImg} alt="Avatar" />
						<h2>{friend.pseudo.length > 10 ? `${friend.pseudo.slice(0, 10)}.` : friend.pseudo}</h2>
						<div className={`${friend.status}`}></div>
						<div className="message">
							<DmButton login="aleroy"/*{friend.login}*//>
							<div className="svg">
								<Link to={"/"}>
									<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M4 22C4 17.5817 7.58172 14 12 14C16.4183 14 20 17.5817 20 22H18C18 18.6863 15.3137 16 12 16C8.68629 16 6 18.6863 6 22H4ZM12 13C8.685 13 6 10.315 6 7C6 3.685 8.685 1 12 1C15.315 1 18 3.685 18 7C18 10.315 15.315 13 12 13ZM12 11C14.21 11 16 9.21 16 7C16 4.79 14.21 3 12 3C9.79 3 8 4.79 8 7C8 9.21 9.79 11 12 11Z"></path></svg>
								</Link>
							</div>
							<DuelButton />
						</div>
					</div>
				))}
			</div>
			<button onClick={onClick}>Add</button>
		</div>
	);
}
import './FriendList.scss';
import userImg from '../../../../asset/images/user.png';
import { Link } from 'react-router-dom';

import DuelButton from '../../../Pong/DuelButton';

interface HistoryProps {
	friends: Array<{ id: number; pseudo: string; status: string; }>;
	requests: Array<{ id: number; from: string; to: string }>;
	onClick: () => void;
}

export default function FriendList({ friends, requests, onClick }: HistoryProps) {

	const friendAccept = (accept: boolean, id: number) => {
		if (accept)
			fetch('http://' + process.env.REACT_APP_POSTURL + ':5000/friends/accept/' + id, { method: 'DELETE' });
		else
			fetch('http://' + process.env.REACT_APP_POSTURL + ':5000/friends/decline/' + id, { method: 'DELETE' });
	}

	return (
		<div className="friends">
			<h1>Friends list</h1>
			<div className="allFriends">
				{friends.length ? friends.map((friend: {
					id: number; pseudo: string; status: string;
				}) => (
					<div className="friendsList" key={friend.id}>
						<img src={userImg} alt="Avatar" />
						<h2>{friend.pseudo.length > 10 ? `${friend.pseudo.slice(0, 10)}.` : friend.pseudo}</h2>
						<div className={`${friend.status}`}></div>
						<div className="message">
							<div className="svg">
								<Link to={"/"}>
									<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M10 3H14C18.4183 3 22 6.58172 22 11C22 15.4183 18.4183 19 14 19V22.5C9 20.5 2 17.5 2 11C2 6.58172 5.58172 3 10 3ZM12 17H14C17.3137 17 20 14.3137 20 11C20 7.68629 17.3137 5 14 5H10C6.68629 5 4 7.68629 4 11C4 14.61 6.46208 16.9656 12 19.4798V17Z"></path></svg>
								</Link>
							</div>
							<div className="svg">
								<Link to={"/"}>
									<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M4 22C4 17.5817 7.58172 14 12 14C16.4183 14 20 17.5817 20 22H18C18 18.6863 15.3137 16 12 16C8.68629 16 6 18.6863 6 22H4ZM12 13C8.685 13 6 10.315 6 7C6 3.685 8.685 1 12 1C15.315 1 18 3.685 18 7C18 10.315 15.315 13 12 13ZM12 11C14.21 11 16 9.21 16 7C16 4.79 14.21 3 12 3C9.79 3 8 4.79 8 7C8 9.21 9.79 11 12 11Z"></path></svg>
								</Link>
							</div>
							<DuelButton/>
						</div>
					</div>
				)) : <h2>No friends yet</h2>}
			</div>
			<div className="requests">
				<h1>Requests</h1>
				{requests.length ? requests.map((request: {
					id: number; from: string; to: string;
				}) => (<div className="request">
							<p className="username">{request.from}</p>
							<a onClick={() => { friendAccept(true, request.id) }}><img src={accept} className="friendAccept friendIcon" /></a>
							<a onClick={() => { friendAccept(false, request.id) }}><img src={decline} className="friendRefuse friendIcon" /></a>
						</div>) ) : <h2>No requests yet</h2>}
			</div>
			<button onClick={onClick}>Add</button>
		</div>
	);
}

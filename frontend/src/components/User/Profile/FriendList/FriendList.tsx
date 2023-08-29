import './FriendList.scss';
// import userImg from '../../../../asset/images/user.png';
import { Link } from 'react-router-dom';
import accept from '../../../../asset/images/checkmark-circle.svg';
import decline from '../../../../asset/images/close-circle.svg';

import DuelButton from '../../../Pong/DuelButton';
import DmButton from '../../Channel/DmButton';

interface HistoryProps {
	friends: Array<{ id: number; login: string; username: string; status: string }>;
	requests: Array<{ id: number; from: string; to: string; fromUsername: string }>;
	updateProfule: (login: string) => void;
	onClick: () => void;
}

export default function FriendList({ friends, requests, onClick, updateProfile }: HistoryProps) {


	const removefriend = (pseudo: string) => () => {
		fetch('http://' + process.env.REACT_APP_POSTURL + ':5000/friends/' + pseudo, { credentials: 'include', method: 'DELETE' });
	}
	const friendAccept = (accept: boolean, id: number) => {
		if (accept)
			fetch('http://' + process.env.REACT_APP_POSTURL + ':5000/friends/accept/' + id, { credentials: 'include', method: 'DELETE' });
		else
			fetch('http://' + process.env.REACT_APP_POSTURL + ':5000/friends/decline/' + id, { credentials: 'include', method: 'DELETE' });
	}

	return (
		<div className="friends">
			<h1>Friends list</h1>
			<div className="allFriends">
				{friends.length ? friends.map((friend: {
					id: number; login: string; username: string; status: string;
				}) => (
					<div className="friendsList" key={friend.id}>
						<div className='friendRemove'>
							<a onClick={removefriend(friend.login)}><img src={decline} alt="decline" /></a>
						</div>
						<h2>{friend.username.length > 10 ? `${friend.username.slice(0, 10)}.` : friend.username}</h2>
						<div className={`${friend.status}`}></div>
						<div className="message">
							<DmButton login={friend.login} />
							<div className="svg">
								<Link to={"/profile/" + friend.login} onClick={() => updateProfile(friend.login)} >
									<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M4 22C4 17.5817 7.58172 14 12 14C16.4183 14 20 17.5817 20 22H18C18 18.6863 15.3137 16 12 16C8.68629 16 6 18.6863 6 22H4ZM12 13C8.685 13 6 10.315 6 7C6 3.685 8.685 1 12 1C15.315 1 18 3.685 18 7C18 10.315 15.315 13 12 13ZM12 11C14.21 11 16 9.21 16 7C16 4.79 14.21 3 12 3C9.79 3 8 4.79 8 7C8 9.21 9.79 11 12 11Z"></path></svg>
								</Link>
							</div>
							<DuelButton login={friend.login} />
						</div>
					</div>
				)) : <h2>No friends yet</h2>}
			</div>
			<div className="requests">
				<h1>Requests</h1>
				{requests.length ? requests.map((request: {
					id: number; from: string; to: string; fromUsername: string;
				}) => (<div className="request">
					<p className="username">{request.fromUsername}</p>
					<div className='requestButtons'>
						<a onClick={() => { friendAccept(true, request.id) }}><img src={accept} alt="accept" className="friendAccept friendIcon" /></a>
						<a onClick={() => { friendAccept(false, request.id) }}><img src={decline} alt="decline" className="friendRefuse friendIcon" /></a>
					</div>
				</div>)) : <h2>No requests yet</h2>}
			</div>
			<button onClick={onClick}>Add</button>
		</div>
	);
}

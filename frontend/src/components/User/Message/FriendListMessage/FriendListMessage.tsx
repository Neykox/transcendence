import './FriendListMessage.scss';
import userImg from '../../../../asset/images/user.png';
import { Link, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';



interface HistoryProps {
	friends: Array<{ id: number; name: string; status: string; }>;
}

function FriendListMessage({ friends }: HistoryProps) {
	const [selectedFriendId, setSelectedFriendId] = useState<number | null>(null);
	const { id } = useParams<{ id?: any }>();

	useEffect(() => {
		if (!id) {
			const friendList = document.querySelector(".friendList");

			friendList?.classList.remove("is-disbaled");
		}
	}, [id]);

	const handleSelectMessage = (id: number) => {
		setSelectedFriendId(id);
	}


	return (
		<div className="friendList">
			{friends.map((friend) => (
				<Link to={`/message/${friend.id}`} state={{ friend: friend }} key={friend.id} >
					<div className={`friend ${selectedFriendId === friend.id ? 'selected' : ''}`} onClick={() => handleSelectMessage(friend.id)}>
						<img src={userImg} alt="Avatar" />
						<h2>{friend.name}</h2>
						<div className={`${friend.status}`}></div>
					</div>
				</Link>
			))}
		</div>

	);
}

export default FriendListMessage;
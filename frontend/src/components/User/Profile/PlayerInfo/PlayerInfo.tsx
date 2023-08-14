import React, { useRef, useEffect, useContext } from 'react';
//import userImg from '../../../../asset/images/user.png';
import './PlayerInfo.scss';
//import {userInfo} from '../../../../model/userInfo'; 
import UserContext from '../../../../model/userContext';

interface PlayerInfoProps {
	wins: number;
	loses: number;
	profile: any;
}

function PlayerInfo({ wins, loses, profile}: PlayerInfoProps) {
	const winBarRef = useRef<HTMLDivElement>(null);
	const lossBarRef = useRef<HTMLDivElement>(null);
	const { user } = (useContext(UserContext));

	//   Le useEffect est un Hook de React qui permet d'effectuer une action à 
	// 	chaque fois que le composant auquel il est rattaché est affiché à l'écran ou mis à jour
	useEffect(() => {
		if (winBarRef.current && lossBarRef.current) {
			const winBar = winBarRef.current;
			const lossBar = lossBarRef.current;

			winBar.style.width = `calc((100% / ${wins + loses}) * ${wins})`;
			winBar.querySelector('.label')!.textContent = `${wins}`;

			lossBar.style.width = `calc((100% / ${wins + loses}) * ${loses})`;
			lossBar.style.left = winBar.style.width;
			lossBar.querySelector('.label')!.textContent = `${loses}`;
			if (lossBar.offsetWidth === 0)
				winBar.style.borderRadius = '10px';
			else if (lossBar.offsetWidth === 100) {
				lossBar.style.borderRadius = '10px';
			} else if (lossBar.offsetWidth !== 100 && lossBar.offsetWidth !== 0) {
				winBar.style.borderRadius = '10px 0 0 10px';
				lossBar.style.borderRadius = '0 10px 10px 0';
			}

		}
	}, [wins, loses]);

	return (
		<div className="header">
			<div className="left">
				<img {...{ src: user.image, alt: 'Avatar' }} />	
				<div className="name">
					<h1>{!profile ? user.pseudo : (profile.username ? profile.username : profile.login)}</h1>
				</div>
			</div>
			<div className="right">
				<h1>Total match</h1>
				<div className="bar-container">
					<div className="win-bar bar" ref={winBarRef}>
						<span className="label"></span>
					</div>
					<div className="loss-bar bar" ref={lossBarRef}>
						<span className="label"></span>
					</div>
				</div>
			</div>
		</div>
	);
}

export default PlayerInfo;

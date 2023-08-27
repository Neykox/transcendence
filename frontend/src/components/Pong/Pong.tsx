import { React, useRef, useEffect, useState, useCallback } from 'react'
import { Ball, Paddle } from '../../shared/interfaces/game.interface'
import { socket } from '../Socket/socketInit';
import './Pong.scss'
import { useNavigate } from "react-router-dom";


function Pong({ paddle1, paddle2, newBall, max_score, toLobby }) {

	const myEventHandler2 = useCallback(data => {
		p1.current = data.p1;
		p2.current = data.p2;
		ball.current = data.ball
		setScore({ p1: p1.current.score, p2: p2.current.score });//maybe not change state everyframe
		resize.current = true;
	}, []);

	useEffect(() => {
		socket.on('newFrame', myEventHandler2);
		return () => socket.off('newFrame', myEventHandler2);
	}, [myEventHandler2]);

	const myEventHandler = useCallback(data => {
		setEnded(true);
		let requestOptions
		if (data.p1.socketId === socket.id)
			requestOptions = {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify({ id: Date().toLocaleString(), opponent: data.p2.name, scores: data.p1.score + "/" + data.p2.score, result: data.p1.score > data.p2.score ? "matchWin" : "matchLose" }),
			};
		else
			requestOptions = {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify({ id: Date().toLocaleString(), opponent: data.p1.name, scores: data.p2.score + "/" + data.p1.score, result: data.p2.score > data.p1.score ? "matchWin" : "matchLose" }),
			};
		fetch("http://"+ process.env.REACT_APP_POSTURL + ":5000/users/addGameToHistory", requestOptions);
	}, []);

	useEffect(() => {
		socket.on('score', myEventHandler);
		return () => socket.off('score', myEventHandler)
	}, [myEventHandler]);

	const canvasRef = useRef<HTMLCanvasElement>(null);

	let resize: boolean = useRef(true);

	const handleKeyDown = event => {
		event.preventDefault();
		if (ended === false)//need to reword this condition
		{
			if (event.keyCode === 38)//up
			{
				if (paddle1.socketId === socket.id)
					socket.emit("updatePlayer", {dir: -1, room:p1.current.room, socketId:p1.current.socketId});
				else
					socket.emit("updatePlayer", {dir: -1, room:p2.current.room, socketId:p2.current.socketId});
			}
			if (event.keyCode === 40)//down
			{
				if (paddle1.socketId === socket.id)
					socket.emit("updatePlayer", {dir: 1, room:p1.current.room, socketId:p1.current.socketId});
				else
					socket.emit("updatePlayer", {dir: 1, room:p2.current.room, socketId:p2.current.socketId});
			}
		}
	};

	let p1: Paddle = useRef(paddle1);
	let p2: Paddle = useRef(paddle2);
	let ball: Ball = useRef(newBall);
	const [score, setScore] = useState({ p1: p1.current.score, p2: p2.current.score });
	const [ended, setEnded] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {

		const canvas = canvasRef.current!;
		if (!canvas)
			return;

		const ctx = canvas.getContext('2d')!;
		if (!ctx)
			return;

		function resizeCanvas() {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
			resize.current = true;
		}

		resizeCanvas();

		window.addEventListener('resize', resizeCanvas);


		const draw_background = () => {
			ctx.fillStyle = '#000000';
			ctx.fillRect(0, 0, canvas.width, canvas.height);

			//middle line
			ctx.strokeStyle = "white";
			ctx.lineWidth = 5;
			ctx.setLineDash([canvas.height, 1]);
			ctx.beginPath();
			ctx.moveTo(canvas.width / 2, 0);
			ctx.lineTo(canvas.width / 2, canvas.height);
			ctx.stroke();
		}

		const draw_ball = () => {
			ctx.beginPath();
			ctx.fillStyle = ball.current.color;
			ctx.arc(ball.current.x + ball.current.dx, ball.current.y, ball.current.radius, 0, 2 * Math.PI);
			ctx.fill();
			ctx.closePath();
		}

		const draw_paddle = (paddle: Paddle) => {
			ctx.fillStyle = paddle.color;
			ctx.fillRect(paddle.x, paddle.y, paddle.w, paddle.h);
		}

		function animate() {

			if (resize.current) {
				const orignalWidth = 1200;
				const orignalHeight = 800;
				const currentWidth = canvas.width;
				const currentHeight = canvas.height;
				const rx = currentWidth / orignalWidth;
				const ry = currentHeight / orignalHeight;
				const scale = rx < ry ? rx : ry;
				if (rx > ry) {
					canvas.width = orignalWidth * rx;
					canvas.height = orignalHeight * rx;
				} else {
					canvas.width = orignalWidth * ry;
					canvas.height = orignalHeight * ry;
				}


				p1.current.x *= scale;
				p1.current.y *= scale;
				p1.current.w *= scale;
				p1.current.h *= scale;

				p2.current.x *= scale;
				p2.current.y *= scale;
				p2.current.w *= scale;
				p2.current.h *= scale;

				ball.current.x *= scale;
				ball.current.y *= scale;
				ball.current.radius *= scale;

				resize.current = false;
			}


			window.requestAnimationFrame(animate);
			draw_background();
			draw_ball();
			draw_paddle(p1.current);
			draw_paddle(p2.current);
		}

		animate();

		return () => {
			window.removeEventListener('resize', resizeCanvas);
		};
	}, [resize, max_score,])

	return (
		<>
			{ended === false
				? <div className="e" tabIndex={0} onKeyDown={handleKeyDown}>
					<div className="scoreboard">
						<div className="cells">{p1.current.name}</div>
						<div className="cells">{score.p1} : {score.p2}</div>
						<div className="cells">{p2.current.name}</div>
					</div>
					<canvas ref={canvasRef}></canvas>
				</div>
				:
				<div className="endScreen">
					<div className="endText">
						{p1.current.score === max_score ? p1.current.name : p2.current.name} won!
						<div className="endButtons">
							<button className="endButton" type="button" onClick={toLobby}>Lobby</button>
							<button className="endButton" type="button" onClick={() => { navigate('/profile') }}>Profile</button>
						</div>
					</div>
				</div>}
		</>
	)
}

export default Pong

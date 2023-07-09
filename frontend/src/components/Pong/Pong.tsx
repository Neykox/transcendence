import { React, useRef, useEffect, useState } from 'react'
import { Ball, Paddle, Toile } from '../../shared/interfaces/game.interface'
import { socket } from '../Socket/socketInit';
import './Pong.scss'


function Pong({newToile, paddle1, paddle2, newBall, max_score}) {

	socket.on('newFrame', (data) => {
		// console.log(data);
		p1 = data.p1;
		p2 = data.p2;
		ball = data.ball
		setScore({p1: p1.score, p2: p2.score});//maybe not change state everyframe
		// resize.current = true;
	} );

	const canvasRef = useRef<HTMLCanvasElement>(null); 

	let resize: boolean = useRef(true);

	const handleKeyDown = event => {
		event.preventDefault();
		if (p1.score < max_score && p2.score < max_score)
		{
			if (event.keyCode === 38)//up
			{
				if (paddle1.socketId === socket.id)
					p1.dir = -1;
				else
					p2.dir = -1;
				socket.emit("updateGame", {p1, p2});
			}
			if (event.keyCode === 40)//down
			{
				if (paddle1.socketId === socket.id)
					p1.dir = 1;
				else
					p2.dir = 1;
				socket.emit("updateGame", {p1, p2});
			}
		}
	};

	let p1: Paddle = paddle1;	
	let p2: Paddle = paddle2;
	let ball: Ball = newBall;
	let toile: Toile = newToile;
	const [score, setScore] = useState({p1: p1.score, p2: p2.score});

	useEffect(() => {

		const canvas = canvasRef.current!;
		if (!canvas)
			return;

		const ctx = canvas.getContext('2d')!;
		if (!ctx)
			return;

		function resizeCanvas() {
			canvas.width = window.innerWidth ;
			canvas.height = window.innerHeight ;
			resize.current = true;
		}
	
		resizeCanvas();
	
		window.addEventListener('resize', resizeCanvas);

	
		const draw_background = () => {
			ctx.fillStyle = '#000000';
			ctx.fillRect(0, 0, canvas.width, canvas.height);

			// ctx.fillStyle  = "white";
			ctx.strokeStyle = "white";
			ctx.lineWidth = 15;
			ctx.setLineDash([15, 15]);
			ctx.beginPath();
			ctx.moveTo(canvas.width/2, 0);
			ctx.lineTo(canvas.width/2, canvas.height);
			ctx.stroke();

			ctx.fillStyle = "red";
			ctx.fillRect(0, 800, 1200, 10);

			ctx.fillStyle = "blue";
			ctx.fillRect(0, 0, 1, canvas.height);
			ctx.fillRect(0, 0, canvas.width, 1);
			ctx.fillRect(canvas.width - 1, 0, canvas.width, canvas.height);
			ctx.fillRect(0, canvas.height - 1, canvas.width, canvas.height);
		}
	
		const draw_ball = () => {
			ctx.beginPath();
			ctx.fillStyle = ball.color;
			ctx.arc(ball.x + ball.dx, ball.y, ball.radius, 0, 2*Math.PI);
			ctx.fill();
			ctx.closePath();
		}
	
		const draw_paddle = (paddle: Paddle) => {
			ctx.fillStyle = paddle.socketId === socket.id ? "red" : "white";
			ctx.fillRect(paddle.x, paddle.y, paddle.w, paddle.h);
		}

		function animate() {

			if (resize.current)
			{
				toile.oldx = toile.x;
				toile.oldy = toile.y;
				toile.x = canvas.width;
				toile.y = canvas.height;
				toile.rx = toile.x / toile.oldx;
				toile.ry = toile.y / toile.oldy;

				// p1.x = canvas.width * 0.1;
				// p1.y = canvas.height / 3;
				// p1.w = canvas.width / 80;
				// p1.h = canvas.height / 3;

				// p2.x = canvas.width * 0.9;
				// p2.y = canvas.height / 3;
				// p2.w = canvas.width / 80;
				// p2.h = canvas.height / 3;

				// ball.x *= toile.rx;
				// ball.y *= toile.ry;
				// ball.radius = 3 + canvas.height / 40;

				resize.current = false;
			}

			
			window.requestAnimationFrame(animate);
			draw_background();
			draw_ball();
			draw_paddle(p1);
			draw_paddle(p2);

			//write end screen / stop game
			if (p1.score === max_score || p2.score === max_score)
			{
				ctx.font = "48px serif";
				ctx.fillStyle = 'white';
				ctx.fillText((p1.score === 5 ? 'P1' : 'P2') + ' won!', canvas.width / 2, canvas.height / 2)
			}
		}

		animate();

		return () => {
			window.removeEventListener('resize', resizeCanvas);
		};
	}, [resize, p1, p2, ball, toile, max_score, ])
  
	return (
		<>
			<div className="scoreboard">
				<div className="d">{p1.socketId}</div>
				<div className="d">{score.p1} : {score.p2}</div>
				<div className="d">{p2.socketId}</div>
			</div>
			<div className="e" tabIndex={0} onKeyDown={handleKeyDown} style={{border: "5px solid green"}}>
				<canvas ref={canvasRef}></canvas>
			</div>
		</>
	)
}

export default Pong

// ctx.fillRect(x, y, width, height)
// ctx.arc(x, y, radius, startAngle, endAngle, counterclockwise);

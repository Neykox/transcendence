import { React, useRef, useEffect, useState } from 'react'
import { Ball, Paddle } from '../../shared/interfaces/game.interface'
import { socket } from '../Socket/socketInit';
import './Pong.scss'


function DoubleBall({paddle1, paddle2, newBall, newBall2, max_score}) {

	socket.on('newFrame', (data) => {
		// console.log(data);
		p1 = data.p1;
		p2 = data.p2;
		ball = data.ball
		ball2 = data.ball2
		setScore({p1: p1.score, p2: p2.score});//maybe not change state everyframe
		resize.current = true;
	} );

	const canvasRef = useRef<HTMLCanvasElement>(null); 

	let resize: boolean = useRef(true);

	const handleKeyDown = event => {
		event.preventDefault();
		// console.log(p1, p2)
		if (p1.dc === false || p2.dc === false)//need to reword this condition
		{
			if (event.keyCode === 38)//up
			{
				if (paddle1.socketId === socket.id)
					socket.emit("updatePlayer", {"p":{dir: -1, room:p1.room, socketId:p1.socketId}});
				else
					socket.emit("updatePlayer", {"p":{dir: -1, room:p2.room, socketId:p2.socketId}});
			}
			if (event.keyCode === 40)//down
			{
				if (paddle1.socketId === socket.id)
					socket.emit("updatePlayer", {"p":{dir: 1, room:p1.room, socketId:p1.socketId}});
				else
					socket.emit("updatePlayer", {"p":{dir: 1, room:p2.room, socketId:p2.socketId}});
			}
		}
	};

	let p1: Paddle = paddle1;	
	let p2: Paddle = paddle2;
	let ball: Ball = newBall;
	let ball2: Ball = newBall2;
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

			//middle line
			ctx.strokeStyle = "white";
			ctx.lineWidth = 15;
			ctx.setLineDash([15, 15]);
			ctx.beginPath();
			ctx.moveTo(canvas.width/2, 0);
			ctx.lineTo(canvas.width/2, canvas.height);
			ctx.stroke();
		}

		const draw_boundingbox = () => {
			const rx = canvas.width / 1200;
			const ry = canvas.height / 800;
			const scale = rx < ry ? rx : ry;
			ctx.fillStyle = "purple";
			ctx.fillRect(0, 0, 1, 800 * scale);
			ctx.fillRect(0, 0, 1200 * scale, 1);
			ctx.fillRect(1200 * scale - 1, 0, 1200 * scale, 800 * scale);
			ctx.fillRect(0, 800 * scale - 1, 1200 * scale, 800 * scale);
		}
	
		const draw_ball = (ball: Ball) => {
			ctx.beginPath();
			ctx.fillStyle = ball.color;
			ctx.arc(ball.x + ball.dx, ball.y, ball.radius, 0, 2*Math.PI);
			ctx.fill();
			ctx.closePath();
		}
	
		const draw_paddle = (paddle: Paddle) => {
			ctx.fillStyle = paddle.color;
			ctx.fillRect(paddle.x, paddle.y, paddle.w, paddle.h);
		}

		function animate() {

			if (resize.current)
			{
				const orignalWidth = 1200;
				const orignalHeight = 800;
				const currentWidth = canvas.width;
				const currentHeight = canvas.height;
				const rx = currentWidth / orignalWidth;
				const ry = currentHeight / orignalHeight;
				const scale = rx < ry ? rx : ry;

				p1.x *= scale;
				p1.y *= scale;
				p1.w *= scale;
				p1.h *= scale;

				p2.x *= scale;
				p2.y *= scale;
				p2.w *= scale;
				p2.h *= scale;

				ball.x *= scale;
				ball.y *= scale;
				ball.radius *= scale;

				ball2.x *= scale;
				ball2.y *= scale;
				ball2.radius *= scale;

				resize.current = false;
			}

			
			window.requestAnimationFrame(animate);
			draw_background();
			draw_boundingbox();
			draw_ball(ball);
			draw_ball(ball2);
			draw_paddle(p1);
			draw_paddle(p2);

			//write end screen / stop game
			if (p1.score === max_score || p2.score === max_score)
			{
				ctx.font = "48px serif";
				ctx.fillStyle = 'white';
				ctx.fillText((p1.score === max_score ? p1.name : p2.name) + ' won!', canvas.width / 2, canvas.height / 2)
			}
		}

		animate();

		return () => {
			window.removeEventListener('resize', resizeCanvas);
		};
	}, [resize, p1, p2, ball, ball2, max_score, ])
  
	return (
		<div className="e" tabIndex={0} onKeyDown={handleKeyDown}>
			<div className="scoreboard">
				<div className="cells">{p1.name}</div>
				<div className="cells">{score.p1} : {score.p2}</div>
				<div className="cells">{p2.name}</div>
			</div>
			<canvas ref={canvasRef}></canvas>
		</div>
	)
}

export default DoubleBall

// ctx.fillRect(x, y, width, height)
// ctx.arc(x, y, radius, startAngle, endAngle, counterclockwise);

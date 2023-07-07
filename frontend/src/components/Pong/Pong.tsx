import { React, useRef, useEffect } from 'react'
import { Ball, Paddle, Toile } from '../../shared/interfaces/game.interface'
import { socket } from '../Socket/socketInit';


function Pong({newToile, paddle1, paddle2, newBall}) {

	socket.on('newFrame', (data) => {
		// console.log(data);
		p1 = data.p1;
		p2 = data.p2;
		ball = data.ball
		resize.current = true;
	} );

	const canvasRef = useRef<HTMLCanvasElement>(null); 

	let resize: boolean = useRef(true);

	const handleKeyDown = event => {
		event.preventDefault();
		if (p1.score < 2 && p2.score < 2)
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

	let p1: Paddle = paddle1.socketId === socket.id ? paddle1 : paddle2;	
	let p2: Paddle = paddle1.socketId === socket.id ? paddle2 : paddle1;
	let ball: Ball = newBall;
	let toile: Toile = newToile


	useEffect(() => {

		const canvas = canvasRef.current!;
		if (!canvas)
			return;

		const ctx = canvas.getContext('2d')!;
		if (!ctx)
			return;

		function resizeCanvas() {
			canvas.width = window.innerWidth - 10;//-10 to allow the 5px border to show
			canvas.height = window.innerHeight - 10;
			resize.current = true;
		}
	
		resizeCanvas();
	
		window.addEventListener('resize', resizeCanvas);

	
		// ball.radius = 3 + canvas.height / 40;
		// ball.h = canvas.width / 80;
		// ball.w = canvas.width / 80;
		// ball.color = 'white';
		// ball.x = canvas.width / 2;	
		// ball.y = canvas.height / 2;
	
		const draw_background = () => {
			ctx.fillStyle = '#000000';
			ctx.fillRect(0, 0, canvas.width, canvas.height);
		}
	
		const draw_ball = () => {
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

			//write score
			ctx.font = "48px serif";
			ctx.fillStyle = 'white';
			ctx.fillText(p1.score + ":" + p2.score, canvas.width / 2, 40)

			//write end screen / stop game
			if (p1.score === 2 || p2.score === 2)
			{
				ctx.fillText((p1.score === 5 ? 'P1' : 'P2') + ' won!', canvas.width / 2, canvas.height / 2)
			}
		}

		animate();

		return () => {
			window.removeEventListener('resize', resizeCanvas);
		};
	}, [resize, p1, p2, ball, toile, ])
  
	return (
		<>
			<div className="e" tabIndex={0} onKeyDown={handleKeyDown}>
				<canvas ref={canvasRef} style={{border: "5px solid red"}}></canvas>
			</div>
		</>
	)
}

export default Pong

// ctx.fillRect(x, y, width, height)
// ctx.arc(x, y, radius, startAngle, endAngle, counterclockwise);

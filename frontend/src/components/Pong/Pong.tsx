import { React, useRef, useEffect } from 'react'
import { Ball, Paddle } from '../../shared/interfaces/game.interface'
import { socket } from '../Socket/socketInit';


function Pong({paddle1, paddle2, newBall}) {

	const sendMessage = () => {
		socket.emit("updatePlayers", {p1, p2});

		socket.on('playerMoved', (data) => {
			// console.log(data);
			p1 = data.p1;
			p2 = data.p2;
		} )
	};

	const canvasRef = useRef<HTMLCanvasElement>(null); 

	let resize: boolean = useRef(true);

	const handleKeyDown = event => {
		event.preventDefault();
		if (event.keyCode === 38)//up
		{
			if (paddle1.socketId === socket.id)
			{
				p1.dir = -1;
				p2.dir = 0;
			}
			else
			{
				p1.dir = 0;
				p2.dir = -1;
			}
			sendMessage();
		}
		if (event.keyCode === 40)//down
		{
			if (paddle1.socketId === socket.id)
			{
				p1.dir = 1;
				p2.dir = 0;
			}
			else
			{
				p1.dir = 0;
				p2.dir = 1;
			}
			sendMessage();
		}
	};


	type Toile = {
		x: number;
		y: number;
		oldx: number;
		oldy: number;
		rx: number;
		ry: number;
	}

	let p1: Paddle = paddle1.socketId === socket.id ? paddle1 : paddle2;	
	let p2: Paddle = paddle1.socketId === socket.id ? paddle2 : paddle1;
	let ball: Ball = newBall;

	useEffect(() => {

		const interval = setInterval(() => {
			p1.dir = 0;
			p2.dir = 0;
			sendMessage();
		}, 600);//makes sure the paddles are assigned and updated at the start

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
	

		let toile: Toile = {
			x: canvas.width,
			y: canvas.height,
			oldx: canvas.width,
			oldy: canvas.height,
		}


	
		ball.radius = 3 + canvas.height / 40;
		ball.color = 'white';
		ball.x = canvas.width / 2;	
		ball.y = canvas.height / 2;
	
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

				ball.x *= toile.rx;
				ball.y *= toile.ry;
				ball.radius = 3 + canvas.height / 40;

				resize.current = false;
			}

			
			window.requestAnimationFrame(animate);
			draw_background();
			draw_ball();
			draw_paddle(p1);
			draw_paddle(p2);

			//ball movement
			ball.x += ball.dx;
			ball.y += ball.dy;


			//ball colliding with wall
			if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
				ball.dy = -ball.dy;
			}

			//reset ball / increment score
			if (ball.x + ball.radius >= canvas.width) {
				ball.x = canvas.width / 2;
				ball.y = canvas.height / 2;
				ball.dx = -ball.dx;
				ball.dy = 7 * (Math.floor(Math.random() * 2) ? 1 : -1);
				p1.score += 1;
			}
			if (ball.x - ball.radius <= 0) {
				ball.x = canvas.width / 2;
				ball.y = canvas.height / 2;
				ball.dx = -ball.dx;
				ball.dy = 7 * (Math.floor(Math.random() * 2) ? 1 : -1);
				p2.score += 1;
			}

			//ball colliding with paddles, not feeling to good may need revision
			// if ((ball.x + ball.radius <= p1.x + p1.w && ball.x + ball.radius >= p1.x) && (ball.y + ball.radius <= p1.y + p1.h && ball.y + ball.radius >= p1.y)) {
			// 	ball.dx = -ball.dx;
			// }
			// if ((ball.x + ball.radius <= p2.x + p2.w && ball.x + ball.radius >= p2.x) && (ball.y + ball.radius <= p2.y + p2.h && ball.y + ball.radius >= p2.y)) {
			// 	ball.dx = -ball.dx;
			// }
			if (
				ball.x - ball.radius < p1.x + p1.w &&
				ball.x > p1.x &&
				ball.y < p1.y + p1.h &&
				ball.radius + ball.y > p1.y
			)
				ball.dx = -ball.dx;
			if (
				ball.x < p2.x + p2.w &&
				ball.x + ball.radius > p2.x &&
				ball.y < p2.y + p2.h &&
				ball.radius + ball.y > p2.y
			)
				ball.dx = -ball.dx;

			// rect1.x < rect2.x + rect2.w &&
			// rect1.x + rect1.w > rect2.x &&
			// rect1.y < rect2.y + rect2.h &&
			// rect1.h + rect1.y > rect2.y

			//write score
			ctx.font = "48px serif";
			ctx.fillStyle = 'white';
			ctx.fillText(p1.score + ":" + p2.score, canvas.width / 2, 40)

			//write end screen / stop game
			if (p1.score === 2 || p2.score === 2)
			{
				ball.dx = 0;
				ball.dy = 0;
				ball.color = 'black';
				ctx.fillText((p1.score === 5 ? 'P1' : 'P2') + ' won!', canvas.width / 2, canvas.height / 2)
			}
		}

		animate();

		return () => {
			window.removeEventListener('resize', resizeCanvas);
			clearInterval(interval);
		};
	}, [resize, p1, p2, ball, sendMessage])
  
	return (
		<>
			<div className="e" tabIndex={0} onKeyDown={handleKeyDown}>
				<canvas ref={canvasRef}></canvas>
				{/*<button onClick={resetGame}> reset game </button>*/}
			</div>
		</>
	)
}

export default Pong

// ctx.fillRect(x, y, width, height)
// ctx.arc(x, y, radius, startAngle, endAngle, counterclockwise);

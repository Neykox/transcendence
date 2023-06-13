import { React, useRef, useEffect } from 'react'
import './Pong.scss';

function Pong() {

	const canvasRef = useRef<HTMLCanvasElement>(null);

	let up: boolean = useRef(false);
	let down: boolean = useRef(false);
	let reset: boolean = useRef(true);
	let resize: boolean = useRef(false);

	const handleKeyDown = event => {
		if (event.keyCode === 38)//up
		{
			up.current = true;
			down.current = false;
			// p1.y -= p1.dy
		}
		if (event.keyCode === 40)//down
		{
			up.current = false;
			down.current = true;
			// p1.y += p1.dy
		}
	};

	const resetGame = () => {
		reset.current = true;
	}

	type Toile = {
		x: number;
		y: number;
		oldx: number;
		oldy: number;
		rx: number;
		ry: number;
	}

	type Paddle = {
		x: number;
		y: number;
		dy: number;
		w: number;
		h: number;
		score: number;
		color: string;
	}

	type Ball = {
		x: number;
		y: number;
		dx: number;
		dy: number;
		radius: number;
		color: string;
		w: number;
		h: number;
	}

	useEffect(() => {

		const canvas = canvasRef.current!;
		if (!canvas)
			return;

		const ctx = canvas.getContext('2d')!;
		if (!ctx)
			return;

		let toile: Toile = {
			x: canvas.width,
			y: canvas.height,
			oldx: canvas.width,
			oldy: canvas.height,
		}

		function resizeCanvas() {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
			resize.current = true;
		}
	
		resizeCanvas();
	
		window.addEventListener('resize', resizeCanvas);
	
		let p1: Paddle = {
			x: canvas.width * 0.1,
			y: canvas.height / 3,
			dy: 10,
			w: canvas.width / 80,
			h: canvas.height / 3,
			score: 0,
			color: 'blue',
		}
	
		let p2: Paddle = {
			x: canvas.width * 0.9,
			y: canvas.height / 3,
			dy: 0,
			w: canvas.width / 80,
			h: canvas.height / 3,
			score: 0,
			color: 'red',
		}
	
		let ball: Ball = {
			radius: 3 + canvas.height / 40,
			color: 'white'
		}
	
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

				p1.x *= toile.rx;
				p1.y *= toile.ry;
				p1.w = canvas.width / 80;
				p1.h = canvas.height / 3;

				p2.x *= toile.rx;
				p2.y *= toile.ry;
				p2.w = canvas.width / 80;
				p2.h = canvas.height / 3;

				ball.x *= toile.rx;
				ball.y *= toile.ry;
				ball.radius = 3 + canvas.height / 40;

				resize.current = false;
			}

			if (reset.current)
			{
				ball.x = canvas.width / 2;
				ball.y = canvas.height / 2;
				ball.dx = 7 * (Math.floor(Math.random() * 2) ? 1 : -1);
				ball.dy = 7 * (Math.floor(Math.random() * 2) ? 1 : -1);
				p1.score = 0;
				p2.score = 0;
				ball.color = 'white';
				reset.current = false;
			}
			window.requestAnimationFrame(animate);
			draw_background();
			draw_ball();
			// draw_paddle(ball);
			draw_paddle(p1);
			draw_paddle(p2);

			//ball movement
			ball.x += ball.dx;
			ball.y += ball.dy;

			//player movement
			if (up.current)
			{
				p1.y -= p1.dy;
				up.current = false
			}
			if (down.current)
			{
				p1.y += p1.dy
				down.current = false;
			}


			//ball colliding with wall
			if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
				ball.dy = -ball.dy;
			}

			if (ball.x + ball.radius > canvas.width) {
				ball.x = canvas.width / 2;
				ball.y = canvas.height / 2;
				ball.dx = -ball.dx;
				ball.dy = 7 * (Math.floor(Math.random() * 2) ? 1 : -1);
				p1.score += 1;
			}
			if (ball.x - ball.radius < 0) {
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

			//write score
			ctx.font = "48px serif";
			ctx.fillStyle = 'white';
			ctx.fillText(p1.score + ":" + p2.score, canvas.width / 2, 40)

			if (p1.score === 2 || p2.score === 2)
			{
				ball.dx = 0;
				ball.dy = 0;
				ball.color = 'black';
				ctx.fillText((p1.score === 5 ? 'P1' : 'P2') + ' won!', canvas.width / 2, canvas.height / 2)
			}
		}

		animate();

		return () => window.removeEventListener('resize', resizeCanvas);
	}, [up, down, reset, resize])
  
	return (
		<>
			<div className="e" tabIndex={0} onKeyDown={handleKeyDown}>
				<canvas ref={canvasRef}></canvas>
				<button onClick={resetGame}> reset game </button>
			</div>
		</>
	)
}

export default Pong

// ctx.fillRect(x, y, width, height)
// ctx.arc(x, y, radius, startAngle, endAngle, counterclockwise);
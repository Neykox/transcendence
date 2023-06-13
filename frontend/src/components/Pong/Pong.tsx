import { React, useRef, useEffect } from 'react'
import './Pong.scss';

const Pong = props => {

	const canvasRef = useRef(null);

	let up: boolean = useRef(false);
	let down: boolean = useRef(false);
	let reset: boolean = useRef(false);

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

	useEffect(() => {

		const canvas = canvasRef.current;
		const ctx = canvas.getContext('2d');

		type Paddle = {
			x: number;
			y: number;
			dy: number;
			w: number;
			d: number;
			score: number;
		}

		let p1: Paddle = {
			x: 50,
			y: 200,
			dy: 10,
			w: 10,
			h: 200,
			score: 0
		}

		let p2: Paddle = {
			x: 1150,
			y: 200,
			dy: 0,
			w: 10,
			h: 200,
			score: 0
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

		let ball: Ball = {
			x: canvas.width / 2,
			y: canvas.height / 2,
			dx: 7,
			dy: 7,
			radius: 15,
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
			ctx.fillStyle = 'white';
			ctx.fillRect(paddle.x, paddle.y, paddle.w, paddle.h);
		}



		function animate() {
			if (reset.current)
			{
				ball.x = canvas.width / 2;
				ball.y = 1 + Math.random() * canvas.height;
				ball.dx = 7;
				ball.dy = 7;
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
				ball.y = 1 + Math.random() * canvas.height;;
				ball.dx = -ball.dx;
				p1.score += 1;
			}
			if (ball.x - ball.radius < 0) {
				ball.x = canvas.width / 2;
				ball.y = 1 + Math.random() * canvas.height;
				ball.dx = -ball.dx;
				p2.score += 1;
			}

			//ball colliding with paddles, not feeling to good may need revision
			if ((ball.x + ball.radius <= p1.x + p1.w && ball.x + ball.radius >= p1.x) && (ball.y + ball.radius <= p1.y + p1.h && ball.y + ball.radius >= p1.y)) {
				ball.dx = -ball.dx;
			}
			if ((ball.x + ball.radius <= p2.x + p2.w && ball.x + ball.radius >= p2.x) && (ball.y + ball.radius <= p2.y + p2.h && ball.y + ball.radius >= p2.y)) {
				ball.dx = -ball.dx;
			}

			//write score
			ctx.font = "48px serif";
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
	}, [up, down, reset])
  
	return (
		<>
			<div className="e" tabIndex={0} onKeyDown={handleKeyDown}>
				<canvas ref={canvasRef} width="1200" height="500" {...props}/>
				<button onClick={resetGame}> reset game </button>
			</div>
		</>
	)
}

export default Pong

// ctx.fillRect(x, y, width, height)
// ctx.arc(x, y, radius, startAngle, endAngle, counterclockwise);
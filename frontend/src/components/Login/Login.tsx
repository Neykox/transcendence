import './Login.scss';
import { useEffect, useRef } from 'react';

function Login() {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const canvas = canvasRef.current!;
		if (!canvas) {
			return;
		}

		const ctx = canvas.getContext('2d')!;
		if (!ctx) {
			return;
		}

		// Mettre à jour la taille du canvas en fonction de la taille de la fenêtre
		function resizeCanvas() {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
		}

		resizeCanvas();

		window.addEventListener('resize', resizeCanvas);

		interface Dot {
			x: number;
			y: number;
			dx: number;
			dy: number;
			radius: number;
		}

		const dots: Dot[] = [];
		const dotCount = 200;

		// Création des points
		for (let i = 0; i < dotCount; i++) {
			const x = Math.random() * canvas.width;
			const y = Math.random() * canvas.height;
			const dx = (Math.random() - 0.5) * 2;
			const dy = (Math.random() - 0.5) * 2;
			const radius = 1 + Math.random() * 3;
			dots.push({ x, y, dx, dy, radius });
		}

		// Animation des points
		function animate() {
			requestAnimationFrame(animate);

			ctx.clearRect(0, 0, canvas.width, canvas.height);

			for (let i = 0; i < dotCount; i++) {
				const dot = dots[i];

				// Mouvement des points
				dot.x += dot.dx * 2;
				dot.y += dot.dy * 2;

				// Rebond des points sur les bords de l'écran
				if (dot.x + dot.radius > canvas.width || dot.x - dot.radius < 0) {
					dot.dx = -dot.dx;
				}
				if (dot.y + dot.radius > canvas.height || dot.y - dot.radius < 0) {
					dot.dy = -dot.dy;
				}

				// Dessin des points
				ctx.beginPath();
				ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
				ctx.fillStyle = 'white';
				ctx.fill();
				ctx.closePath();
			}
		}

		animate();

		// Retirer le gestionnaire d'événements sur le redimensionnement de la fenêtre
		return () => window.removeEventListener('resize', resizeCanvas);
	}, []);

	const login_link = 'https://api.intra.42.fr/oauth/authorize?client_id=' + process.env.REACT_APP_UID42 + '&redirect_uri=http%3A%2F%2F' + process.env.REACT_APP_POSTURL + '%2Fpage1&response_type=code';
	// const search = useLocation().search; //if search=NULL need to try to login
	// const code = new URLSearchParams(search).get('code'); //if code=NULL access was denied
	// let access_token;
	console.log(process.env.REACT_APP_POSTURL)
	return (
		<div className='login'>
			<canvas ref={canvasRef}></canvas>
			<div className="loginPage">
				<div className="title">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M11.5 2C16.7467 2 21 6.25329 21 11.5C21 13.0291 20.6387 14.4739 19.9969 15.7536L22.4602 18.2175C22.8507 18.608 22.8507 19.2412 22.4602 19.6317L19.6317 22.4602C19.2412 22.8507 18.608 22.8507 18.2175 22.4602L15.7536 19.9969C14.4739 20.6387 13.0291 21 11.5 21C6.25329 21 2 16.7467 2 11.5C2 6.25329 6.25329 2 11.5 2ZM16.8033 15.3877L15.3891 16.8019L18.9246 20.3375L20.3388 18.9233L16.8033 15.3877ZM18.6669 9.28305L9.28305 18.6669C9.98371 18.8834 10.7282 19 11.5 19C12.4671 19 13.3914 18.817 14.2403 18.4836L13.2678 17.5104C12.8772 17.1199 12.8772 16.4867 13.2678 16.0962L16.0962 13.2678C16.4867 12.8772 17.1199 12.8772 17.5104 13.2678L18.4836 14.2403C18.817 13.3914 19 12.4671 19 11.5C19 10.7282 18.8834 9.98371 18.6669 9.28305ZM11.5 4C7.35786 4 4 7.35786 4 11.5C4 14.1135 5.3368 16.4148 7.36394 17.7574L17.7574 7.36394C16.4148 5.3368 14.1135 4 11.5 4Z" fill="#ae75e3"></path></svg>
					<h1>Ping Pong</h1>
				</div>
				<a href={login_link} className="login42">42 Auth</a>
			</div>
		</div>
	);
}

export default Login;

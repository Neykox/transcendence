// export interface User {
// 	userId: string
// 	userName: string
// 	socketId: string
// }

// export interface Room {
// 	name: string
// 	host: User
// 	users: User[]
// }

export interface Paddle {
	x: number;
	y: number;
	dy: number;
	dir: number;
	w: number;
	h: number;
	score: number;
	color: string;
	pseudo: string;
}

export interface User {
	userId: string
	userName: string
	socketId: string
}

export interface Room {
	host: string
	p1: Paddle
	p2: Paddle
}
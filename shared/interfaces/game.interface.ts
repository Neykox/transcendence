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
	room: string;
	socketId: string;
}

export interface Ball {
	x: number;
	y: number;
	dx: number;
	dy: number;
	radius: number;
	color: string;
	w: number;
	h: number;
}

export interface User {
	userId: string
	userName: string
	socketId: string
}

export interface Room {
	p1: Paddle
	p2: Paddle
}

export interface Toile {
	x: number
	y: number
	oldx: number
	oldy: number
	rx: number;
	ry: number;
}
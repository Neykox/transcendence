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
	name: string;
	dc: boolean;
}

export interface Ball {
	x: number;
	y: number;
	dx: number;
	dy: number;
	radius: number;
	color: string;
}

export interface User {
	userId: string
	userName: string
	socketId: string
}

export interface Room {
	p1: Paddle
	p2: Paddle
	// ball: Ball
	// ball2: Ball
	// room: string
	// gametype: string
}

export interface Toile {
	x: number
	y: number
	oldx: number
	oldy: number
	rx: number;
	ry: number;
}
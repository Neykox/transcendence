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

export interface User {
	userId: string
	userName: string
	socketId: string
}

export interface Room {
	name: string
	p1: User
	p2: User
}
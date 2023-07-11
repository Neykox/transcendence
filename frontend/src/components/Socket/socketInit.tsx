import io from "socket.io-client";

// export const socket = io.connect("http://localhost:5000");

export const socket = io.connect("http://192.168.1.123:5000");
//gotta put the ip of the pc runnings the server to allow external connection, maybe through env var?

import { io } from "socket.io-client";

export const createSocketConnection = (token) => {
  const socket = io("http://localhost:3000", {
    auth: {
      token,
    },
    autoConnect: false,
  });

  return socket;
};

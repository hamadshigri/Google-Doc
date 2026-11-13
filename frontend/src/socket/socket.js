import { io } from "socket.io-client";
import { BASE_URL } from "../lib/config";

export const createSocketConnection = (token) => {
  const socket = io(BASE_URL, {
    auth: {
      token,
    },
    autoConnect: false,
  });

  return socket;
};

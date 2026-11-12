import jwt from "jsonwebtoken";

export const socketAuthentication = (socket, next) => {
    try{
        const token = socket.handshake.auth?.token;

        if(!token) {
            return next(new Error("Authentication token missing"));
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        socket.userId = decoded.id;
        next();
    } catch(error) {
        next(new Error("Invalid or expired token"));
    }
}
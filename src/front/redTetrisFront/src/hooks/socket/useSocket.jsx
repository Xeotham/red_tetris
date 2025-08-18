import React, {createContext, useContext, useState} from "react";
import { io } from "socket.io-client";
import {address} from "../../main.jsx";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
	const [socket, setSocket] = useState(() => io(`http://${address}`, {}));
	// console.log(socket);
	return (
		<SocketContext.Provider value={socket}>
			{children}
		</SocketContext.Provider>
	);
};

export const useSocket = () => useContext(SocketContext);
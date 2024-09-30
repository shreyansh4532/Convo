// eslint-disable-next-line
import { useAppStore } from "@/store";
import { HOST } from "@/utils/constants";
import { createContext, useEffect, useRef, useContext } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null); // eslint-disable-line

export const useSocket = () => {   // eslint-disable-line
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {  // eslint-disable-line

  const socket = useRef();
  const { userInfo } = useAppStore();

  useEffect(() => {
    // Component mounts...
    if (userInfo) {
      socket.current = io(HOST, {
        withCredentials: true,
        query: { userId: userInfo.id },
      });

      socket.current.on("connect", () => {
        console.log(`Connected to Socket server`);
      });

      const handleReceiveMessage = (message) => {
        // eslint-disable-line
        const { selectedChatData, selectedChatType, addMessage } =
          useAppStore.getState();

        if (
          selectedChatType !== undefined &&
          (selectedChatData._id === message.sender._id ||
            selectedChatData._id === message.recipient._id)
        ) {
          addMessage(message);
          console.log("MSG RCV: ", message);
          
        }
      };

      socket.current.on("receiveMessage", handleReceiveMessage);

      // Component unmounts...
      return () => {
        socket.current.disconnect();
      };
    }
  }, [userInfo]);

  return (
    <SocketContext.Provider value={socket.current}>
      {children}
    </SocketContext.Provider>
  );
};

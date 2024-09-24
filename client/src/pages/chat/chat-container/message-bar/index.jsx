import { useEffect, useRef, useState } from "react";
import { GrAttachment } from "react-icons/gr";
import { RiEmojiStickerLine } from "react-icons/ri";
import { IoSend } from "react-icons/io5";
import EmojiPicker from "emoji-picker-react";
import { useAppStore } from "@/store";
import { useSocket } from "../../../../../context/SocketContext";

const MessageBar = () => {
  const {selectedChatType, selectedChatData, userInfo} = useAppStore();
  const socket = useSocket();
  const [message, setMessage] = useState("");
  const emojiRef = useRef();
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);

  useEffect(() => {
    function handleOutsideClick(event) {
      if (emojiRef.current && !emojiRef.current.contains(event.target)) {
        setEmojiPickerOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [emojiRef]);

  const handleSendMessage = async () => { 
    if(selectedChatType === "contact") {
      socket.emit("sendMessage", {
        sender: userInfo.id,
        content: message,
        messageType: "text",
        fileUrl: undefined,
        recipient: selectedChatData._id
      })
      console.log("MSG SENT!!");
      
    }
  };

  const handleAddEmoji = (emoji) => {
    setMessage((msg) => msg + emoji.emoji);
  };

  return (
    <div className="h-[10vh] bg-[#1c1d25] flex items-center justify-center gap-6 px-8 mb-6">
      <div className="flex-1 bg-[#2a2b33] rounded-md flex items-center gap-5 pr-5">
        <input
          type="text"
          className="bg-transparent p-5 rounded-md focus:border-none focus:outline-none flex-1"
          placeholder="Enter Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button className="text-neutral-500 focus:border-none focus:text-white focus:outline-none duration-300 transition-all">
          <GrAttachment className="text-2xl" />
        </button>
        {/* file attachment inout */}
        <div className="relative">
          <button
            className="text-neutral-500 focus:border-none focus:text-white focus:outline-none duration-300 transition-all"
            onClick={() => setEmojiPickerOpen((prev) => !prev)}
          >
            <RiEmojiStickerLine className="text-2xl" />
          </button>
          <div className="absolute bottom-16 right-0" ref={emojiRef}>
            <EmojiPicker
              theme="dark"
              open={emojiPickerOpen}
              onEmojiClick={handleAddEmoji}
              autoFocusSearch={false}
            />
          </div>
        </div>
      </div>
      <button
        className="bg-[#8417ff] rounded-md focus:outline-none focus:border-none duration-300 transition-all focus:text-white flex items-center justify-center p-5 hover:bg-[#741bda] focus:bg-[#741bda]"
        onClick={handleSendMessage}
      >
        <IoSend className="text-2xl" />
      </button>
    </div>
  );
};

export default MessageBar;

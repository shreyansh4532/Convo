import { useAppStore } from "@/store";
import moment from "moment";
import { useEffect, useRef } from "react";

const MessageContainer = () => {
  // eslint-disable-next-line
  const { selectedChatType, selectedChatData, userInfo, selectedChatMessages } =
    useAppStore();
  const scrollRef = useRef();

  useEffect(() => {
    if (scrollRef.current)
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
  }, [selectedChatMessages]);

  const renderMessages = () => {
    let lastDate = null;
    return selectedChatMessages.map((message, i) => {
      const messageDate = moment(message.timestamp).format("YYYY-MM-DD");
      const showDate = messageDate !== lastDate;
      lastDate = messageDate;
      return (
        <div key={i}>
          {showDate && (
            <div className="text-center text-gray-500 my-2">
              {moment(message.timestamp).format("LL")}
            </div>
          )}

          {selectedChatType === "contact" && renderDMMessages(message)}
        </div>
      );
    });
  };

  const renderDMMessages = (message) => (
    <div
      className={`${
        message.sender === selectedChatData._id ? "text-left" : "text-right"
      }`}
    >
      {message.messageType === "text" && (
        <div
          className={`${
            message.sender !== selectedChatData._id
              ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
              : "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20"
          } border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
        >
          {message.content}
        </div>
      )}
      <div className="text-xs text-gray-600">
        {moment(message.timestamp).format("LT")}
      </div>
    </div>
  );

  return (
    <div className="w-full overflow-y-auto flex-1 p-4 px-8 md:w-[65vw] lg:w-[70vw] xl:w-[80vw]">
      {renderMessages()}
      <div ref={scrollRef} />
    </div>
  );
};

export default MessageContainer;

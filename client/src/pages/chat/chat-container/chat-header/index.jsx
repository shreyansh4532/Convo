import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { getColors } from "@/lib/utils";
import { useAppStore } from "@/store";
import { HOST } from "@/utils/constants";
import { RiCloseFill } from "react-icons/ri";

const ChatHeader = () => {
  const { closeChat, selectedChatData: contact } = useAppStore();

  return (
    <div className="h-[10vh] border-b-2 border-[#2f303b] flex items-center justify-between px-20 py-8">
      <div className="flex gap-5 items-center">
        {/* Chat & Channel name */}
        <div className="flex gap-3 items-center justify-center">
          <div className="w-12 h-12 relative">
            <Avatar className="h-12 w-12 overflow-hidden rounded-full">
              {contact.image ? (
                <AvatarImage  
                  src={`${HOST}/contact.image`}
                  alt="Profile image"
                  className="w-full h-full object-cover bg-black"
                />
              ) : (
                <div
                  className={`uppercase h-12 w-12 text-lg border-[1px] flex items-center justify-center rounded-full ${getColors(
                    contact.color
                  )}`}
                >
                  {contact.firstName
                    ? contact.firstName[0]
                    : contact.email[0]}
                </div>
              )}
            </Avatar>
          </div>
          <div>
            {contact.firstName && contact.lastName
              ? `${contact.firstName} ${contact.lastName}`
              : ""}
          </div>
        </div>
        <div className="flex items-center justify-center gap-5">
          <button
            className="text-neutral-500 focus:border-none focus:text-white focus:outline-none duration-300 transition-all"
            onClick={closeChat}
          >
            <RiCloseFill className="text-3xl" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;

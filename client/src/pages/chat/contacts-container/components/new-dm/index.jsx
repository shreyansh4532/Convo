import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { animationDefaultOptions, getColors } from "@/lib/utils";
import Lottie from "react-lottie";
import { FaPlus } from "react-icons/fa";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { apiClient } from "@/lib/api-client";
import { HOST, SEARCH_ROUTE } from "@/utils/constants";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useAppStore } from "@/store";

const NewDM = () => {
  const {setSelectedChatData, setSelectedChatType} = useAppStore();

  const [openNewContactModal, setOpenNewContactModal] = useState(false);
  const [searchContacts, setSearchContacts] = useState([]);

  const handleSearchContacts = async (searchVal) => {
    try {
      if (searchVal.length > 0) {
        const res = await apiClient.post(
          SEARCH_ROUTE,
          { searchVal },
          {
            withCredentials: true,
          }
        );
        if (res.status === 200 && res.data.contacts) {
          setSearchContacts(res.data.contacts);
          console.log(searchContacts);
        }
      } else {
        setSearchContacts([]);
      }
    } catch (error) {
      console.log({ error });
    }
  };

  const handleSelectNewContact = (contact) => {
    setOpenNewContactModal(false);
    setSelectedChatType("contact");
    setSelectedChatData(contact);
    setSearchContacts([]);
  }

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <FaPlus
              className="text-neutral-400 font-light text-opacity-90 text-sm hover:text-neutral-100 cursor-pointer transition-all duration-300"
              onClick={() => setOpenNewContactModal(true)}
            />
          </TooltipTrigger>
          <TooltipContent className="bg-[#1c1b1e] border-none p-3 mb-2">
            Select New Contact
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Dialog open={openNewContactModal} onOpenChange={setOpenNewContactModal}>
        <DialogContent className="bg-[#181920] border-none w-[400px] h-[400px] text-white flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-center">
              Please Select a Contact
            </DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <Input
            placeholder="Search Contacts"
            className="rounded-xl p-6 bg-[#2c2e3b] border-none"
            onChange={(e) => handleSearchContacts(e.target.value)}
          />
          {/* LOTTIE SVG */}

          <ScrollArea className="h-[250px]">
              {searchContacts.map((contact) => (
                <div
                  key={contact._id}
                  className="flex gap-3 cursor-pointer items-center"
                  onClick={() => handleSelectNewContact(contact)}
                >
                  <div className="h-12 w-12">
                    <Avatar className="h-12 w-12 overflow-hidden rounded-full">
                      {contact.image ? (
                        <AvatarImage
                          src={`${HOST}/userInfo.image`}
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
                  <div className="flex flex-col">
                    <span>
                      {contact.firstName && contact.lastName
                        ? `${contact.firstName} ${contact.lastName}`
                        : `${contact.email}`}
                    </span>
                    <span className="text-xs">{contact.email}</span>
                  </div>
                </div>
              ))}
            </ScrollArea>

          {searchContacts.length == 0 && (
            <div className="mt-4">
              <Lottie
                isClickToPauseDisabled={true}
                height={150}
                width={150}
                options={animationDefaultOptions}
              />
              <div className="text-opacity-80 text-white flex flex-col gap-5 items-center mt-5 text-xl lg:text-2xl transition-all duration-300 text-center">
                <h3 className="poppins-medium">
                  Hi<span className="text-purple-500">!</span>{" "}
                  <span className="text-purple-500">Search</span> Something
                </h3>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NewDM;

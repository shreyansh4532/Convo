import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useAppStore } from "@/store";
import { getColors } from "@/lib/utils";
import { HOST, LOGOUT_ROUTE } from "@/utils/constants";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FaEdit } from "react-icons/fa";
import { TbLogout } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import { apiClient } from "@/lib/api-client";

const ProfileInfo = () => {
  const { userInfo, setUserInfo } = useAppStore();
  const navigate = useNavigate();

  const logOut = async () => {
    try {
      const res = await apiClient.post(LOGOUT_ROUTE, {}, {withCredentials: true});
      console.log(res);
      
      if(res.status === 200) {
        navigate("/auth");
        setUserInfo(null);
      }
    } catch (error) {
      console.log({error});      
    }
  }

  return (
    <div className="absolute bottom-0 flex items-center justify-between px-10 w-full bg-[#2a2b33] h-16">
      <div className="flex gap-3 items-center justify-center">
        <div className="w-12 h-12 relative">
          <Avatar className="h-12 w-12 overflow-hidden rounded-full">
            {userInfo.image ? (
              <AvatarImage
                src={`${HOST}/userInfo.image`}
                alt="Profile image"
                className="w-full h-full object-cover bg-black"
              />
            ) : (
              <div
                className={`uppercase h-12 w-12 text-lg border-[1px] flex items-center justify-center rounded-full ${getColors(
                  userInfo.color
                )}`}
              >
                {userInfo.firstName ? userInfo.firstName[0] : userInfo.email[0]}
              </div>
            )}
          </Avatar>
        </div>
        <div>
          {userInfo.firstName && userInfo.lastName
            ? `${userInfo.firstName} ${userInfo.lastName}`
            : ""}
        </div>
        <div className="flex items-center gap-2 mx-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <FaEdit className="text-purple-500 text-xl font-medium" onClick={() => navigate("/profile")}/>
              </TooltipTrigger>
              <TooltipContent className="bg-[#1c1b1e]">
                <p>Edit</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <TbLogout className="text-red-500 text-xl font-medium" onClick={logOut}/>
              </TooltipTrigger>
              <TooltipContent className="bg-[#1c1b1e]">
                <p>Logout</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;

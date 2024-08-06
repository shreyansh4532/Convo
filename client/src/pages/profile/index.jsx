import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import { useAppStore } from "@/store";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { colors, getColors } from "@/lib/utils";
import { FaPlus, FaTrash } from "react-icons/fa";
import { Input } from "@/components/ui/input";

const Profile = () => {
  const navigate = useNavigate();
  const { userInfo, setUserInfo } = useAppStore();
  const [firstName, setfirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [image, setImage] = useState(undefined);
  const [hovered, setHovered] = useState(false);
  const [selectedColor, setSelectedColor] = useState(0);

  return (
    <div className="h-[100vh] flex items-center justify-center flex-col gap-10 bg-[#1b1c24]">
      <div className="">
        <div>
          <IoArrowBack className="text-4xl text-white cursor-pointer lg:text-6xl" />
        </div>
        <div className="grid grid-cols-2">
          <div
            className="h-full w-32 md:h-48 md:w-48 relative flex items-center justify-center"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <Avatar className="h-32 w-32 md:h-48 md:w-48 overflow-hidden rounded-full">
              {image ? (
                <AvatarImage
                  src={image}
                  alt="Profile image"
                  className="w-full h-full object-cover bg-black"
                />
              ) : (
                <div
                  className={`uppercase h-32 w-32 md:h-48 md:w-48 border-[1px] flex items-center justify-center rounded-full ${getColors(
                    selectedColor
                  )}`}
                >
                  {firstName ? firstName[0] : userInfo.email[0]}
                </div>
              )}
            </Avatar>
            {hovered && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 cursor-pointer rounded-full">
                {image ? (
                  <FaTrash className="text-white cursor-pointer text-3xl" />
                ) : (
                  <FaPlus className="text-white cursor-pointer text-3xl" />
                )}
              </div>
            )}
            {/* <input type="text" /> */}
          </div>
          <div className="flex items-center justify-center min-w-32 md:min-w-64 text-white flex-col gap-5">
            <div className="w-full">
              <Input
                placeholder="Email"
                type="email"
                disabled
                value={userInfo.email}
                className="bg-[#2c2e3b] p-6 rounded-lg border-none"
              />
            </div>
            <div className="w-full">
              <Input
                placeholder="First name"
                type="text"
                value={firstName}
                onChange={(e) => setLastName(e.target.value)}
                className="bg-[#2c2e3b] p-6 rounded-lg border-none"
              />
            </div>
            <div className="w-full">
              <Input
                placeholder="Last name"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="bg-[#2c2e3b] p-6 rounded-lg border-none"
              />
            </div>
            <div className="flex gap-5 w-full">
              {colors.map((color, index) => (
                <div
                  className={`${color} h-8 w-8 rounded-full cursor-pointer transition-all duration-300 ${
                    selectedColor === index
                      ? "outline outline-white/50 outline-1"
                      : ""
                  }`}
                  key={index}
                  onClick={() => setSelectedColor(index)}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

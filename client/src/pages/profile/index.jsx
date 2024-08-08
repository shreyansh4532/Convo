import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useRef, useState } from "react";
import { useAppStore } from "@/store";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { colors, getColors } from "@/lib/utils";
import { FaPlus, FaTrash } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import {
  ADD_PROFILE_IMAGE_ROUTE,
  UPDATE_PROFILE_ROUTE,
  HOST,
  REMOVE_PROFILE_IMAGE_ROUTE
} from "@/utils/constants";
import { Button } from "@/components/ui/button";

const Profile = () => {
  const navigate = useNavigate();
  const { userInfo, setUserInfo } = useAppStore();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [image, setImage] = useState(undefined);
  const [hovered, setHovered] = useState(false);
  const [selectedColor, setSelectedColor] = useState(0);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (userInfo.profileSetup) {
      setFirstName(userInfo.firstName);
      setLastName(userInfo.lastName);
      setSelectedColor(userInfo.color);
      console.log(`${HOST}/${userInfo.image}`);
      
      if(userInfo.image) setImage(`${HOST}/${userInfo.image}`);
      else setImage(null);
    }
  }, [userInfo]);

  const validateProfile = () => {
    if (!firstName) {
      toast.error("First name is required!");
      return false;
    }
    if (!lastName) {
      toast.error("Last name is required!");
      return false;
    }
    return true;
  };

  const saveChanges = async () => {
    if (validateProfile()) {
      try {
        const res = await apiClient.post(
          UPDATE_PROFILE_ROUTE,
          { firstName, lastName, color: selectedColor },
          { withCredentials: true }
        );

        if (res.status === 200 && res.data) {
          setUserInfo({ ...res.data });
          toast.success("Profile updated successfully.");
          navigate("/chat");
        }
      } catch (error) {
        console.log({ error });
      }
    }
  };

  const handleNavigate = () => {
    if (userInfo.profileSetup) {
      navigate("/chat");
    } else {
      toast.error("Please setup profile!");
    }
  };

  const handleFileInputClick = () => {
    console.log("In handleFileInputClick");    
    fileInputRef.current.click();
  };

  const handleImageChange = async (e) => {
    //! File upload issue
    console.log("In handleImageChange");    
    const file = e.target.files[0];
    console.log({ file });
    if (file) {      
      const formData = new FormData();
      formData.append("profile-image", file);

      try {
        const res = await apiClient.post(ADD_PROFILE_IMAGE_ROUTE, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },  
          withCredentials: true,
        });
        console.log(res);
  
        if (res.status === 200 && res.data.image) {
          setUserInfo({ ...userInfo, image: res.data.image });
          toast.success("Image updated successfully.");
        }        
      } catch (error) {
        console.log({error});        
      }

    }
  };

  const handleImageDelete = async () => {
    try {
      const res = await apiClient.delete(REMOVE_PROFILE_IMAGE_ROUTE, {withCredentials: true});
      console.log(res);
      
      if(res.status === 200) {
        setUserInfo({...userInfo, image: null});
        toast.success("Image removed successfully.");
      }
    } catch (error) {
      console.log({error});      
    }
  };

  return (
    <div className="h-[100vh] flex items-center justify-center flex-col gap-10 bg-[#1b1c24]">
      <div className="flex flex-col gap-7">
        <div>
          <IoArrowBack
            onClick={handleNavigate}
            className="text-4xl text-white cursor-pointer lg:text-6xl"
          />
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
              <div
                className="absolute inset-0 flex items-center justify-center bg-black/50 cursor-pointer rounded-full"
                onClick={image ? handleImageDelete : handleFileInputClick}
              >
                {image ? (
                  <FaTrash className="text-white cursor-pointer text-3xl" />
                ) : (
                  <FaPlus className="text-white cursor-pointer text-3xl" />
                )}
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              onClick={handleImageChange}
              className="hidden"
              accept=".png, .jpg, .jpeg, .svg, .webp"
              name="profile-image"
            />
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
                onChange={(e) => setFirstName(e.target.value)}
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
        <Button
          className="bg-purple-500 hover:bg-purple-600 rounded-xl w-full"
          onClick={saveChanges}
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default Profile;

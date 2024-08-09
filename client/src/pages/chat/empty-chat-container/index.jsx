import { animationDefaultOptions } from "@/lib/utils";
import Lottie from "react-lottie";

const EmptyChatContainer = () => {
  return (
    <div className="flex-1 md:bg-[#1c1d25] justify-center md:flex flex-col items-center hidden duration-1000 transition-all">
      <Lottie
        isClickToPauseDisabled={true}
        height={200}
        width={200}
        options={animationDefaultOptions}
      />
      <div className="text-opacity-80 text-white flex flex-col gap-5 items-center mt-10 text-3xl lg:text-4xl transition-all duration-300 text-center">
        <h3 className="poppins-medium">
          Welcome<span className="text-purple-500">!</span> to{" "}
          <span className="text-purple-500">Convo</span> Chat App
        </h3>
      </div>
    </div>
  );
};

export default EmptyChatContainer;

import Victory from "@/assets/victory.svg";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import { SIGNUP_ROUTE, LOGIN_ROUTE } from "@/utils/constants";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/store";

const Auth = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const {setUserInfo} = useAppStore();

  const validateSignup = () => {
    if(!email.length) {
      toast.error("Email is required.");
      return false;
    }
    if(!password.length) {
      toast.error("Password is required.");
      return false;
    }
    if(password !== confirmPassword) {
      toast.error("Password and confirm password should be same.");
      return false;
    }
    return true;
  }

  const validateLogin = () => {
    if(!email.length) {
      toast.error("Email is required.");
      return false;
    }
    if(!password.length) {
      toast.error("Password is required.");
      return false;
    }
    return true;
  }

  const handleLogin = async () => {
    if(validateLogin()) {
      const res = await apiClient.post(LOGIN_ROUTE, {email, password}, {withCredentials: true});
      console.log(res);
      if(res.data.user.id) {
        setUserInfo(res.data.user);
        if(res.data.user.profileSetup) navigate("/chat");
        else navigate("/profile");
      }
    }
  }

  const handleSignup = async () => {
    if(validateSignup()) {
      const res = await apiClient.post(SIGNUP_ROUTE, {email, password}, {withCredentials: true});
      console.log(res);
      if(res.status === 201) {
        setUserInfo(res.data.user);
        navigate("/profile");
      } 
    }
  }

  return (
    <div className="h-[100vh] w-[100vw] flex items-center justify-center">
      <div className="h-[80vh] w-[80vw] bg-white border-2 border-white text-opacity-90 shadow-2xl md:w-[90vw] lg:w-[70vw] xl:w-[60vw] rounded-3xl xl:grid-cols-2 flex items-center justify-center">
        <div className="flex flex-col justify-center items-center gap-10">
          <div className="flex items-center justify-center flex-col">
            <div className="flex items-center justify-center">
              <h1 className="text-5xl font-bold md:text-6xl">Welcome</h1>
              <img className="h-[100px]" src={Victory} alt="" />
            </div>
            <p className="font-medium text-center">
              Fill in the details to get started with this awesome chat app!
            </p>
          </div>
          <div className="flex items-center justify-center w-full">
            <Tabs className="w-3/4" defaultValue="login">
              <TabsList className="bg-transparent rounded-none w-full">
                <TabsTrigger
                  value="login"
                  className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300"
                >
                  Login
                </TabsTrigger>
                <TabsTrigger
                  value="signup"
                  className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300"
                >
                  Signup
                </TabsTrigger>
              </TabsList>
              <TabsContent className="mt-10 flex flex-col gap-5" value="login">
                <Input
                className="p-6 rounded-full"
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                className="p-6 rounded-full"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button className="bg-slate-900 hover:bg-slate-800 text-white rounded-full p-6" onClick={handleLogin}>Login</Button>
              </TabsContent>
              <TabsContent className="flex flex-col gap-5" value="signup">
              <Input
                className="p-6 rounded-full"
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                className="p-6 rounded-full"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Input
                className="p-6 rounded-full"
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <Button className="bg-slate-900 hover:bg-slate-800 text-white rounded-full p-6" onClick={handleSignup}>Signup</Button>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;

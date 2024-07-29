import { useAppStore } from "@/store"


const Profile = () => {
  const {userInfo} = useAppStore();

  return (
    <div>
      Profile
      <div>{userInfo.email}</div>
      <div>{userInfo.id}</div>
    </div>
  )
}

export default Profile
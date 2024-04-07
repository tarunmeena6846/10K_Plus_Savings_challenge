import { Avatar, Dropdown } from "flowbite-react";
import { useRecoilState } from "recoil";
import { userState } from "./store/atoms/user";
import { useNavigate } from "react-router-dom";
export default function UserAvatar() {
  const [currentUserState, setCurrentUserState] = useRecoilState(userState);
  const navigate = useNavigate();

  return (
    <Dropdown
      label={
        <Avatar
          alt="User settings"
          img="./target.png"
          className="pt-5 pl-10"
          size="lg"
          rounded
        />
      }
      arrowIcon={true}
      inline
    >
      <Dropdown.Header>
        <span className="block text-sm">{currentUserState.userEmail}</span>
        <span className="block truncate text-sm font-medium">
          {currentUserState.userEmail}
        </span>
      </Dropdown.Header>
      <Dropdown.Divider />
      <Dropdown.Item>Account Setting</Dropdown.Item>
      <Dropdown.Divider />
      <Dropdown.Item
        onClick={() => {
          localStorage.removeItem("token");
          setCurrentUserState({
            userEmail: "",
            isLoading: false,
            imageUrl: currentUserState.imageUrl,
            isVerified: currentUserState.isVerified,
            myWhy: currentUserState.myWhy,
          });

          navigate("/");
        }}
      >
        Sign out
      </Dropdown.Item>
    </Dropdown>
  );
}

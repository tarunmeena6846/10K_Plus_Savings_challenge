// import React, { useState, useRef, useEffect } from "react";
// import Avatar from "@mui/material/Avatar";
// import { userState } from "./store/atoms/user";
// import { useRecoilState } from "recoil";

// const UserAvatar = ({ size = 40 }) => {
//   const [isEditing, setIsEditing] = useState(false);
//   const [currentUserState, setCurrentUserState] = useRecoilState(userState);
//   const fileInputRef = useRef(null);

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         const imageUrl = reader.result as string;
//         setCurrentUserState({
//           userEmail: currentUserState.userEmail,
//           isLoading: currentUserState.isLoading,
//           imageUrl: imageUrl as string,
//           isVerified: currentUserState.isVerified,
//         });
//         setIsEditing(false); // Reset isEditing after handling image change
//         // Clear the file input value to allow selecting the same file again
//         if (fileInputRef.current) {
//           (fileInputRef.current as HTMLInputElement).value = "";
//         }
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleClick = () => {
//     if (fileInputRef.current) {
//       (fileInputRef.current as HTMLInputElement).click();
//     }
//     // Trigger the click event on the file input when the avatar is clicked
//     // fileInputRef.current.click();
//   };

//   useEffect(() => {
//     if (isEditing) {
//       handleClick();
//     }
//   }, [isEditing]);

//   return (
//     <div style={{ position: "relative" }}>
//       <Avatar
//         alt="User Avatar"
//         src={currentUserState.imageUrl}
//         style={{ width: size, height: size, cursor: "pointer" }}
//         onClick={handleClick}
//       />

//       <input
//         accept="image/*"
//         id="avatar-upload"
//         type="file"
//         style={{ display: "none" }}
//         onChange={handleImageChange}
//         ref={fileInputRef}
//       />

//       {isEditing && (
//         <label htmlFor="avatar-upload">
//           <Avatar
//             alt="Edit Avatar"
//             src={currentUserState.imageUrl}
//             style={{
//               position: "absolute",
//               top: 0,
//               left: 0,
//               width: size,
//               height: size,
//             }}
//           />
//         </label>
//       )}
//     </div>
//   );
// };

// export default UserAvatar;

import { Avatar, Dropdown } from "flowbite-react";
import { useRecoilState, useRecoilValue } from "recoil";
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

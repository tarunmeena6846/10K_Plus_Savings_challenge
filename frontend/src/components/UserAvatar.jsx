import React, { useState } from "react";
import Avatar from "@mui/material/Avatar";
import { userState } from "./store/atoms/user";
import { useRecoilState } from "recoil";

const UserAvatar = ({ userEmail, size = 40}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentUserState, setCurrentUserState] = useRecoilState(userState);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result;
        // setCustomImage(imageUrl);
        setCurrentUserState({
          userEmail: currentUserState.userEmail,
          isLoading: currentUserState.isLoading,
          imageUrl: imageUrl,
        });
        onImageChange && onImageChange(imageUrl); // Invoke the callback
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClick = () => {
    setIsEditing(true);
  };

  return (
    <div style={{ position: "relative", cursor: "pointer" }}>
      <Avatar
        alt="User Avatar"
        src={currentUserState.imageUrl}
        style={{ width: size, height: size }}
        onClick={handleClick}
      />

      {isEditing && (
        <div>
          <input
            accept="image/*"
            id="avatar-upload"
            type="file"
            style={{ display: "none" }}
            onChange={handleImageChange}
          />
          <label htmlFor="avatar-upload">
            <Avatar
              alt="Edit Avatar"
              src={currentUserState.imageUrl}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: size,
                height: size,
              }}
            />
          </label>
        </div>
      )}
    </div>
  );
};

export default UserAvatar;

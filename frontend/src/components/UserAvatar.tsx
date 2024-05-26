import { useState } from "react";
import { Avatar, Dropdown, Modal } from "flowbite-react";
import { useRecoilState } from "recoil";
import { userState } from "./store/atoms/user";
import { useNavigate } from "react-router-dom";
import { Button, TextField } from "@mui/material";

export default function UserAvatar() {
  const [currentUserState, setCurrentUserState] = useRecoilState(userState);
  const [showImageModal, setShowImageModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showAccountSettingsModal, setShowAccountSettingsModal] =
    useState(false);

  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();
  console.log(currentUserState);
  // Function to handle the selection of an image
  const handleImageSelect = (image) => {
    console.log(image);
    setSelectedImage(image);
  };

  // Function to handle setting the profile image
  const handleSetProfileImage = async (type: string) => {
    console.log(selectedImage);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/auth/change-user_details`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
          body: JSON.stringify({
            // username: currentUserState.userEmail,
            imageUrl: type === "profile picture" ? selectedImage : undefined,
            newPassword: type === "password" ? confirmPassword : undefined,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update user details");
      }
      response.json().then((data) => {
        console.log(data);
      });
      // Update the avatar image URL in the state
      setCurrentUserState((prev: any) => ({
        ...prev,
        imageUrl: selectedImage,
      }));

      // Close the image modal
      setShowImageModal(false);
    } catch (error) {
      console.error("Error updating user details:", error);
      // Handle error
    }
  };

  return (
    <>
      <Dropdown
        label={
          <div className="relative">
            <Avatar
              alt="User settings"
              img={currentUserState.imageUrl || selectedImage || ""}
              className="pt-5 pl-10 cursor-pointer"
              size="lg"
              rounded
              onClick={() => setShowImageModal(true)} // Open image modal on click
            />
          </div>
        }
        inline
      >
        <Dropdown.Header>
          <span className="block text-sm">{currentUserState.userEmail}</span>
        </Dropdown.Header>
        {/* <Dropdown.Divider />
        <Dropdown.Divider /> */}
        <Dropdown.Item onClick={() => setShowAccountSettingsModal(true)}>
          Account Setting
        </Dropdown.Item>
        <Dropdown.Item
          onClick={() => {
            console.log("logout clicked");
            localStorage.removeItem("token");
            setCurrentUserState({
              userEmail: "",
              isLoading: false,
              imageUrl: currentUserState.imageUrl,
              isVerified: currentUserState.isVerified,
              myWhy: currentUserState.myWhy,
              isAdmin: currentUserState.isAdmin,
            });
            navigate("/");
          }}
        >
          Sign out
        </Dropdown.Item>
      </Dropdown>
      {/* Image Modal */}
      <Modal
        show={showImageModal}
        onClose={() => setShowImageModal(false)}
        className="w-96" // Adjust the width as per your requirement
      >
        <Modal.Body>
          <h2 className="text-lg font-bold mb-4">Choose Profile Image</h2>
          {/* Grid of images */}
          <div className="grid grid-cols-3 gap-4">
            {Array.from({ length: 12 }).map((_, index) => (
              <img
                key={index}
                src={`./user${index + 1}.svg`}
                alt={`Image ${index + 1}`}
                onClick={() => handleImageSelect(`./user${index + 1}.svg`)}
              />
            ))}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={() => handleSetProfileImage("profile picture")}
            className="mr-2"
          >
            Set Profile Image
          </Button>
          <Button onClick={() => setShowImageModal(false)}>Cancel</Button>
        </Modal.Footer>
      </Modal>

      {/* Account Settings Modal */}
      <Modal
        show={showAccountSettingsModal}
        onClose={() => setShowAccountSettingsModal(false)}
        className="w-96" // Adjust the width as per your requirement
      >
        <Modal.Body>
          <h2 className="text-lg font-bold mb-4">Account Settings</h2>
          <Avatar
            alt="User settings"
            img={currentUserState.imageUrl || selectedImage || ""}
            className="mx-auto p-2"
            size="lg"
            rounded
          />
          <TextField
            label="Email"
            variant="outlined"
            value={currentUserState.userEmail}
            fullWidth
            disabled
            // className=""
          />
          <input
            className="border rounded w-full my-2 pt-3 pb-3 pl-3" // Add margin to the top and bottom
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            // fullWidth
          />
          <input
            // label="Confirm Password"
            // variant="outlined"
            placeholder="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            // fullWidth
            className="border rounded w-full my-2 pt-3 pb-3 pl-3" // Add margin to the top and bottom
          />
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={() => handleSetProfileImage("password")}
            className="mr-2"
          >
            Update Password
          </Button>
          <Button onClick={() => setShowAccountSettingsModal(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

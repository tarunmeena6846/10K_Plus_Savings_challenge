import { useState } from "react";
import { Avatar, Dropdown, Modal } from "flowbite-react";
import { useRecoilState } from "recoil";
import { userState } from "./store/atoms/user";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

export default function UserAvatar() {
  const [currentUserState, setCurrentUserState] = useRecoilState(userState);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();
  console.log(currentUserState);
  // Function to handle the selection of an image
  const handleImageSelect = (image) => {
    console.log(image);
    setSelectedImage(image);
  };

  // Function to handle setting the profile image
  const handleSetProfileImage = async () => {
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
            imageUrl: selectedImage,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update user details");
      }
      response.json().then((data) => {
        console.log(data);
      });
      // // Update the avatar image URL in the state
      // setSelectedImage((prev: any) => ({
      //   ...prev,
      //   imageUrl: selectedImage,
      // }));

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
        <Dropdown.Divider />
        <Dropdown.Divider />
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
            });
            navigate("/");
          }}
        >
          Sign out
        </Dropdown.Item>
      </Dropdown>
      {/* Image Modal */}
      <Modal show={showImageModal} onClose={() => setShowImageModal(false)}>
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
          <Button onClick={handleSetProfileImage} className="mr-2">
            Set Profile Image
          </Button>
          <Button onClick={() => setShowImageModal(false)}>Cancel</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

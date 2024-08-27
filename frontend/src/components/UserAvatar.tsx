import { useEffect, useRef, useState } from "react";
import { Dropdown, Modal } from "flowbite-react";
import Avatar from "@mui/material/Avatar";
import { useRecoilState } from "recoil";
import { subscriptionState, userState } from "./store/atoms/user";
import { useNavigate } from "react-router-dom";
import { Button, TextField } from "@mui/material";
import Box from "@mui/material/Box";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";
import Checkbox from "@mui/material/Checkbox";
// import { manageBillingForm } from "../stripe/ManageBillingForm";
import handleBuyClick from "../stripe/SwotCheckout";
import manageBillingInformation from "../stripe/BillingInformation";

export default function UserAvatar() {
  const [currentUserState, setCurrentUserState] = useRecoilState(userState);
  const [imageUrl, setImageUrl] = useState(currentUserState.imageUrl || "");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showUploadButton, setShowUploadButton] = useState(false);
  const [subscription, setSubscription] = useRecoilState(subscriptionState);

  const [isEditing, setIsEditing] = useState(false);

  const fileInputRef = useRef(null);

  const [selectedFile, setSelectedFile] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    const newFileName = `${currentUserState.userEmail}${Date.now()}`;
    const renamedFile = new File([file], newFileName, { type: file.type });
    console.log(renamedFile);
    if (file) {
      setSelectedFile(renamedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl: string = reader.result as string;
        setCurrentUserState((prev) => ({
          ...prev,
          imageUrl: imageUrl,
        }));
        setIsEditing(true); // Reset isEditing after handling image change
        // Clear the file input value to allow selecting the same file again
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      };
      reader.readAsDataURL(renamedFile);
    }
  };

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  useEffect(() => {
    if (isEditing) {
      handleClick();
    }
  }, [isEditing]);

  const [selectedNotifications, setSelectedNotifications] = useState({
    adminPost: true,
    groupPost: true,
    taskListReminder: true,
    monthlySwot: true,
  });

  const navigate = useNavigate();

  const handleChange = (event) => {
    setSelectedNotifications({
      ...selectedNotifications,
      [event.target.name]: event.target.checked,
    });
  };

  const onFileUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("avatar", selectedFile);
    console.log(formData);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/notification/upload-user-profile`,
        {
          method: "POST",
          body: formData,
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upload file");
      }

      const data = await response.json();
      setImageUrl(data.url);
      console.log(data.url);
      setCurrentUserState((prev) => ({
        ...prev,
        imageUrl: data.url,
      }));
      setShowUploadButton(false); // Hide the upload button after successful upload
      setShowAccountSettingsModal(false);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  console.log(currentUserState.imageUrl);
  const handleSaveNotification = async () => {
    console.log(selectedNotifications);

    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/notification/updateNotification`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({
          selectedNotifications,
        }),
      }
    );

    const data = await response.json();

    if (data.success) {
      alert("Notifications updated");
      setShowNotificationSettingModal(false);
    }
  };

  const handleSetProfileImage = async (type) => {
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
      setCurrentUserState((prev) => ({
        ...prev,
        imageUrl: imageUrl,
      }));
    } catch (error) {
      console.error("Error updating user details:", error);
    }
  };

  const { adminPost, groupPost, taskListReminder, monthlySwot } =
    selectedNotifications;
  const [showAccountSettingsModal, setShowAccountSettingsModal] =
    useState(false);
  const [showNotificationSettingModal, setShowNotificationSettingModal] =
    useState(false);

  return (
    <>
      <Dropdown
        // className="bg-white"
        label={
          <div className="relative">
            <Avatar
              alt="User settings"
              src={currentUserState.imageUrl}
              style={{
                width: "80px",
                height: "80px",
                margin: "20px",
                marginLeft: "60px",
              }}
            />
          </div>
        }
        inline
        theme={{ arrowIcon: "text-white" }}
      >
        <Dropdown.Header>
          <span className="block text-sm">{currentUserState.userEmail}</span>
        </Dropdown.Header>
        <Dropdown.Item onClick={() => setShowAccountSettingsModal(true)}>
          Account Setting
        </Dropdown.Item>
        <Dropdown.Item onClick={() => setShowNotificationSettingModal(true)}>
          Notification Setting
        </Dropdown.Item>
        <Dropdown.Item
          onClick={() => handleBuyClick(currentUserState.userEmail)}
        >
          Book SWOT Session
        </Dropdown.Item>
        <Dropdown.Item
          onClick={() =>
            manageBillingInformation(subscription.stripeCustomerId)
          }
        >
          Manage subscription
        </Dropdown.Item>
        {/* <ManageBillingForm /> */}
        <Dropdown.Item
          onClick={() => {
            localStorage.removeItem("token");
            // setCurrentUserState({
            //   userEmail: "",
            //   isLoading: false,
            //   imageUrl: currentUserState.imageUrl,
            //   isVerified: currentUserState.isVerified,
            //   myWhy: currentUserState.myWhy,
            //   isAdmin: currentUserState.isAdmin,
            // });
            setCurrentUserState((prev) => ({
              ...prev,
              userEmail: "",
              isLoading: false,
              // imageUrl: "",
              // isVerified: currentUserState.isVerified,
              // myWhy: currentUserState.myWhy,
              // isAdmin: currentUserState.isAdmin,
            }));
            navigate("/");
          }}
        >
          Sign out
        </Dropdown.Item>
      </Dropdown>
      <Modal
        show={showAccountSettingsModal}
        onClose={() => setShowAccountSettingsModal(false)}
        className="w-96"
      >
        <Modal.Body className="flex flex-col items-center">
          <h2 className="text-lg font-bold mb-4">Account Settings</h2>
          <Avatar
            alt="User Avatar"
            src={currentUserState.imageUrl}
            style={{
              width: "80px",
              height: "80px",
              cursor: "pointer",
              marginBottom: "20px",
            }}
            onClick={handleClick}
          />

          <input
            accept="image/*"
            id="avatar-upload"
            type="file"
            style={{ display: "none" }}
            onChange={handleImageChange}
            ref={fileInputRef}
          />
          {isEditing && <Button onClick={onFileUpload}>Upload Image</Button>}
          <TextField
            label="Email"
            variant="outlined"
            value={currentUserState.userEmail}
            fullWidth
            disabled
          />
          <input
            className="border rounded w-full my-2 pt-3 pb-3 pl-3"
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <input
            placeholder="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="border rounded w-full my-2 pt-3 pb-3 pl-3"
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
      <Modal
        show={showNotificationSettingModal}
        onClose={() => setShowNotificationSettingModal(false)}
        className="w-96" // Adjust the width as per your requirement
      >
        <Modal.Body>
          <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
            <FormLabel component="legend">Select notification type</FormLabel>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={adminPost}
                    onChange={handleChange}
                    name="adminPost"
                  />
                }
                label="Community Admin Post"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={groupPost}
                    onChange={handleChange}
                    name="groupPost"
                  />
                }
                label="Community Group Post"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={taskListReminder}
                    onChange={handleChange}
                    name="taskListReminder"
                  />
                }
                label="Task List Reminder"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={monthlySwot}
                    onChange={handleChange}
                    name="monthlySwot"
                  />
                }
                label="Monthly SWOT Analysis"
              />
            </FormGroup>
          </FormControl>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleSaveNotification} className="mr-2">
            Save Notification
          </Button>
          <Button onClick={() => setShowNotificationSettingModal(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

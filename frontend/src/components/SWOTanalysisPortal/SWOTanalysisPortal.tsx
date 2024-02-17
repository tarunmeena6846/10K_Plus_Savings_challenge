import React, { useEffect, useState } from "react";
import {
  SubscriptionData,
  subscriptionState,
  userState,
} from "../store/atoms/user";
import { useRecoilState } from "recoil";
import redirectToStripeCheckout from "../../stripe/StripeCheckout";
import SWOTdashboard from "./SWOTdashboard";
const SavingPortalLanding = () => {
  const [subscription, setSubscripton] =
    useRecoilState<SubscriptionData>(subscriptionState);
  console.log("subs", subscription);
  const [currentUserState, setCurrentUserState] = useRecoilState(userState);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [showSecondModal, setShowSecondModal] = useState(false);

  const handleVideoModalClose = () => {
    setVideoModalOpen(false);
    setShowSecondModal(true); // Show the second modal when the first modal is closed
  };

  const handleDIYClick = () => {
    setShowSecondModal(false); // Show the second modal when the first modal is closed

    // Handle DIY button click
  };

  const handleBuyClick = async () => {
    // Handle Buy button click
    console.log("before checkout");
    await redirectToStripeCheckout(
      "price_1OjffbSBiPFrlsnb4MjS068p",
      "payment",
      currentUserState.userEmail
    );
    // await StripeCheckout("price_1OjffbSBiPFrlsnb4MjS068p", "payment");
  };
  return (
    <>
      {videoModalOpen && (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-gray-900 bg-opacity-75">
          <div className="relative bg-white rounded-lg shadow-lg p-4 w-full max-w-3xl">
            <button
              onClick={handleVideoModalClose}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <div className="aspect-w-16 aspect-h-9">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/JqYoLQXO7j4"
                title="The importance of saving money"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              ></iframe>
            </div>
          </div>
        </div>
      )}
      {showSecondModal && (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-gray-900 bg-opacity-75">
          <div className="relative bg-white rounded-lg shadow-lg p-4">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-4">Choose an option:</h2>
              <button
                onClick={handleDIYClick}
                className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
              >
                DIY
              </button>
              <button
                onClick={handleBuyClick}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Buy
              </button>
            </div>
          </div>
        </div>
      )}

      <div>
        <SWOTdashboard />
      </div>
    </>
  );
};

export default SavingPortalLanding;

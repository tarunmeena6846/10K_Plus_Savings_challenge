import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { subscriptionState } from "../components/store/atoms/user";
import { Button } from "@mui/material";
import manageBillingInformation from "./BillingInformation";

const ManageBillingForm = () => {
  const [subscription, setSubscription] = useRecoilState(subscriptionState);
  const [loading, setLoading] = useState(false);
  console.log("susbcription", subscription.stripeCustomerId);
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      // Perform any additional actions before creating the billing portal
      // For example, show loading indicator

      await manageBillingInformation(subscription.stripeCustomerId);
      // const response = await fetch(
      //   `${
      //     import.meta.env.VITE_SERVER_URL
      //   }/stripe/create-customer-portal-session`,
      //   {
      //     method: "POST",
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //     body: JSON.stringify({
      //       customerId: subscription.stripeCustomerId,
      //     }),
      //   }
      // );
      // if (!response.ok) {
      //   throw new Error("Failed to create billing portal");
      // }
      // // After creating the billing portal, you may want to handle the response
      // // For example, log the response or perform any necessary actions
      // console.log("Billing portal created successfully");
      // const { url } = await response.json(); // Assuming your backend returns the URL
      // window.location.href = url;
      // Reset loading state after successful submission
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="hidden"
        name="customerId"
        value={subscription.stripeCustomerId}
      />
      <Button
        type="submit"
        disabled={loading}
        style={{
          textTransform: "none",
          background: "black",
          color: "white",
          borderRadius: "20px",
          paddingLeft: "10px",
          paddingRight: "10px",
        }}
      >
        {loading ? "Creating Billing Portal..." : "Manage Billing"}
      </Button>
    </form>
  );
};

export default ManageBillingForm;

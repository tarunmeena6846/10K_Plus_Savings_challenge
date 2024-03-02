import redirectToStripeCheckout from "./StripeCheckout";

const handleBuyClick = async (userEmail) => {
  // Handle Buy button click
  console.log("before checkout");
  await redirectToStripeCheckout(
    "price_1OjffbSBiPFrlsnb4MjS068p",
    "payment",
    userEmail
  );
};
export default handleBuyClick;

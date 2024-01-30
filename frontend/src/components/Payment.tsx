// // import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
// // import { Button, Input } from "antd";
// import React, { useState } from "react";
// // import getStripe from "@stripe/react-stripe-js";

// import { loadStripe } from "@stripe/stripe-js";
// import StripePricingTable from "./StripePricingTable";
// import { useRecoilState } from "recoil";
// import { yearlyPlan } from "./store/atoms/yearlyPlan";
// import { userState } from "./store/atoms/user";
// let stripePromise;
// const getStripe = () => {
//   if (!stripePromise) {
//     stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY);
//   }
//   return stripePromise;
// };

// // export default getStripe;
// // function Payment() {
// //   // collect data from the user
// //   const [name, setName] = useState("");
// //   const [email, setEmail] = useState("");
// //   const [priceId, setPriceId] = useState("price_1OdbMPSDnOSEkJDblq6ynwAO");

// //   // stripe items
// //   const stripe = useStripe();
// //   const elements = useElements();
// //   console.log("cardelement", CardElement);
// //   // main function
// //   const createSubscription = async () => {
// //     try {
// //       // create a payment method
// //       const paymentMethod = await stripe?.createPaymentMethod({
// //         type: "card",
// //         card: elements?.getElement(CardElement)!,
// //         billing_details: {
// //           name,
// //           email,
// //           address: {
// //             line1: "123 Main Street",
// //             line2: "Apt 1",
// //             city: "City",
// //             state: "State",
// //             postal_code: "12345",
// //             country: "US",
// //           },
// //         },
// //       });

// //       // call the backend to create subscription
// //       const response = await fetch(
// //         "http://localhost:3000/data/create-subscription",
// //         {
// //           method: "POST",
// //           headers: {
// //             "Content-Type": "application/json",
// //           },
// //           body: JSON.stringify({
// //             paymentMethod: paymentMethod?.paymentMethod?.id,
// //             name,
// //             email,
// //             priceId,
// //           }),
// //         }
// //       ).then((res) => res.json());
// //       console.log("response at payment", response);
// //       const confirmPayment = await stripe?.confirmCardPayment(
// //         response.data.clientSecret
// //       );

// //       console.log("confirmpayment", confirmPayment);
// //       if (confirmPayment?.error) {
// //         alert(confirmPayment.error.message);
// //       } else {
// //         alert("Success! Check your email for the invoice.");
// //       }
// //     } catch (error) {
// //       console.log(error);
// //     }
// //   };

// //   return (
// //     <div className="grid gap-4 m-auto">
// //       <input // this should not be a text field. maybe a radio button ro something
// //         placeholder="Price Id"
// //         type="text"
// //         value={priceId}
// //         // onChange={(e) => setPriceId(e.target.value)}
// //       />
// //       <input
// //         placeholder="Name"
// //         type="text"
// //         value={name}
// //         onChange={(e) => setName(e.target.value)}
// //       />
// //       <br />
// //       <input
// //         placeholder="Email"
// //         type="text"
// //         value={email}
// //         onChange={(e) => setEmail(e.target.value)}
// //       />

// //       <CardElement />
// //       <button onClick={createSubscription} disabled={!stripe}>
// //         Subscribe
// //       </button>
// //     </div>
// //   );
// // }
// const Payment = async () => {
//   const [selectedYearlyPrice, setSelectedYearlyPrice] =
//     useRecoilState(yearlyPlan);
//   const [currentUserState, setCurrentUserState] = useRecoilState(userState);

//   console.log("selectedyearlyprice", selectedYearlyPrice, currentUserState);
//   async function handleCheckout() {
//   const stripe = await getStripe();
//   const { error } = await stripe.redirectToCheckout({
//     lineItems: [
//       {
//         price: "price_1OdbMPSDnOSEkJDblq6ynwAO",
//         quantity: 1,
//       },
//     ],
//     mode: "subscription",
//     successUrl: `http://localhost:3000/dashboard`,
//     cancelUrl: `http://localhost:3000/`,
//     customerEmail: currentUserState.userEmail,
//     // billing_address_collection: "required",
//     // customer: {
//     //   address: "auto",
//     //   name: "auto",
//     // },
//   });
//   console.warn(error.message);
//   // }
//   // return (
//   //   <div>
//   //     {/* <StripePricingTable /> */}
//   //     <button onClick={handleCheckout}>Checkout</button>;
//   //   </div>
//   // );
// };
// export default Payment;

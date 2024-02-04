// // import { useRecoilState } from "recoil";
// // import { userState } from "../components/store/atoms/user";

// // export async function getUserSubscriptionPlan() {
// //   //   const session = await getAuthSession();
// //   const [currentUserState, setCurrentUserState] = useRecoilState(userState);

// //   if (!currentUserState.userEmail || !session.user) {
// //     throw new Error("User not found.");
// //   }

// // //   const user = await db.user.findFirst({
// // //     where: {
// // //       id: session.user.id,
// // //     },
// // //   });

// // //   if (!user) {
// // //     throw new Error("User not found.");
// // //   }

// //   const isSubscribed =
// //     user.stripePriceId &&
// //     user.stripeCurrentPeriodEnd &&
// //     user.stripeCurrentPeriodEnd.getTime() + 86_400_000 > Date.now();

// //   const plan = isSubscribed
// //     ? storeSubscriptionPlans.find(
// //         (plan) => plan.stripePriceId === user.stripePriceId
// //       )
// //     : null;

// //   let isCanceled = false;
// //   if (isSubscribed && user.stripeSubscriptionId) {
// //     const stripePlan = await stripe.subscriptions.retrieve(
// //       user.stripeSubscriptionId
// //     );
// //     isCanceled = stripePlan.cancel_at_period_end;
// //   }

// //   return {
// //     ...plan,
// //     stripeSubscriptionId: user.stripeSubscriptionId,
// //     stripeCurrentPeriodEnd: user.stripeCurrentPeriodEnd,
// //     stripeCustomerId: user.stripeCustomerId,
// //     isSubscribed,
// //     isCanceled,
// //   };
// // }

// export async function handleSubscription() {
//   // const billingUrl = absoluteUrl("/billing");

//   const stripeSession = await stripe.billingPortal.sessions.create({
//     customer: "cus_PTw0RZfMkmKvKx",
//     return_url: "http://localhost:5173/projecteddashboard",
//   });

//   return { url: stripeSession.url };
// }

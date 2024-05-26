import AdminModel from "../models/admin";

export async function handleSubscriptionCreated(event: any, subscription: any) {
  console.log("tarun event", event, event.customer_email);
  console.log("tarun subs", subscription);

  const userData = await AdminModel.findOne({
    email: event.customer_email,
  });
  console.log("user data ", userData);
  if (userData) {
    try {
      // Push the ObjectId into the subscriptions array
      userData.stripePlanId = subscription.plan.id;
      userData.stripeUserId = event.customer;
      userData.isSubscribed = true;
      if (subscription.plan.id === "price_1OeQmjSBiPFrlsnbPRGm9YvH") {
        userData.isTopTier = true;
      } else {
        userData.isTopTier = false;
      }
      // Save the updated userData document
      await userData.save();
    } catch (error) {
      console.error("Error saving subscription data to MongoDB:", error);
    }
  }
}

export async function handleSubscriptionUpdated(event: any, subscription: any) {
  // Find the admin document
  const userData = await AdminModel.findOne({
    stripeUserId: event.data.object.customer,
  });
  // console.log("user data ", userData);
  if (userData) {
    try {
      // Push the ObjectId into the subscriptions array
      userData.stripePlanId = subscription.plan.id;
      userData.stripeUserId = event.data.object.customer;
      userData.isSubscribed = true;
      if (subscription.plan.id === "price_1OeQmjSBiPFrlsnbPRGm9YvH") {
        userData.isTopTier = true;
      } else {
        userData.isTopTier = false;
      }
      // Save the updated userData document
      await userData.save();
    } catch (error) {
      console.error("Error saving subscription data to MongoDB:", error);
    }
  }
}

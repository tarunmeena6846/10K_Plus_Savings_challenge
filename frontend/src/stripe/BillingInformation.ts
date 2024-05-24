const manageBillingInformation = async (customerId: string) => {
  const response = await fetch(
    `${import.meta.env.VITE_SERVER_URL}/stripe/create-customer-portal-session`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customerId: customerId,
      }),
    }
  );
  if (!response.ok) {
    throw new Error("Failed to create billing portal");
  }
  // After creating the billing portal, you may want to handle the response
  // For example, log the response or perform any necessary actions
  console.log("Billing portal created successfully");
  const { url } = await response.json(); // Assuming your backend returns the URL
  window.location.href = url;
};

export default manageBillingInformation;

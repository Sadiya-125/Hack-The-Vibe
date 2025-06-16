import { PricingTable } from "@clerk/nextjs";

const Subscription = () => {
  return (
    <main className="p-4">
      <PricingTable
        appearance={{
          variables: {
            colorPrimary: "#2F89FC",
          },
        }}
      />
    </main>
  );
};

export default Subscription;

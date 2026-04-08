import { useState } from "react";
import CreateSubscription from "./SubscriptionForm";
import SubscriptionList from "./SubscriptionList";

const App = () => {
  const [refresh, setRefresh] = useState<number>(0);
  return (
    <div className="flex flex-col items-center md:flex-row gap-5 bg-black min-h-screen">
      {/* LEFT SIDE */}
      <div className="grow">
        <CreateSubscription onSuccess={() => setRefresh((prev) => prev + 1)} />
      </div>

      {/* RIGHT SIDE */}
      <div style={{ flex: 2 }}>
        <SubscriptionList refreshTrigger={refresh} />
      </div>
    </div>
  );
};

export default App;

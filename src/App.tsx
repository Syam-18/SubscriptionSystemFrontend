import { useState } from "react";
import axios from "axios";

function App() {
  const [data, setData] = useState({
    user_id: "",
    start_date: "",
    end_date: "",
  });

  const [subscriptions, setSubscriptions] = useState([]);

  const handleSubscribe = async () => {
    try {
      await axios.post("http://localhost:5000/subscribe", data);
      alert("Subscribed!");
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  const fetchSubscriptions = async () => {
    const res = await axios.get(
      `http://localhost:5000/subscriptions/${data.user_id}`,
    );
    setSubscriptions(res.data);
  };

  return (
    <div className="p-5">
      <h2>Subscription System</h2>

      <input
        placeholder="User ID"
        onChange={(e) => setData({ ...data, user_id: e.target.value })}
      />

      <br />

      <input
        type="date"
        onChange={(e) => setData({ ...data, start_date: e.target.value })}
      />

      <br />

      <input
        type="date"
        onChange={(e) => setData({ ...data, end_date: e.target.value })}
      />

      <br />

      <button onClick={handleSubscribe}>Subscribe</button>
      <button onClick={fetchSubscriptions}>View Active</button>

      <ul>
        {subscriptions.map((sub: {id: string, start_date: string, end_date: string}) => (
          <li key={sub.id}>
            {sub.start_date} → {sub.end_date}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;

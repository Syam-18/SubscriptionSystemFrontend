import { useEffect, useState } from "react";

type Subscription = {
  id: number;
  user_id: number;
  start_date: string;
  end_date: string;
};

export default function SubscriptionList({
  refreshTrigger,
}: {
  refreshTrigger: number;
}) {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [filteredSubscriptions, setFilteredSubscriptions] = useState<
    Subscription[]
  >([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch("http://localhost:5000/subscriptions");
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch");
      }

      setSubscriptions(data);
      setFilteredSubscriptions(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, [refreshTrigger]);

  // 🔥 Filter logic (frontend)
  useEffect(() => {
    if (filter === "all") {
      setFilteredSubscriptions(subscriptions);
    } else {
      const today = new Date().toISOString().split("T")[0];

      const filtered = subscriptions.filter((sub) => {
        return sub.start_date <= today && sub.end_date >= today;
      });

      setFilteredSubscriptions(filtered);
    }
  }, [filter, subscriptions]);

  return (
    <div className="text-white flex flex-col gap-2 justify-center md:h-full p-4 max-w-100">
      <h2 className="text-xl font-semibold">Subscriptions</h2>

      <div className="mb-2">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="text-white p-1 rounded border-white border"
        >
          <option value="all" className="bg-white text-black">
            All
          </option>
          <option value="active" className="bg-white text-black">
            Active
          </option>
        </select>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && filteredSubscriptions.length === 0 && (
        <p>No subscriptions found</p>
      )}

      {!loading && filteredSubscriptions.length > 0 && (
        <table>
          <thead>
            <tr>
              <th className="border p-1">User ID</th>
              <th className="border p-1">Start Date</th>
              <th className="border p-1">End Date</th>
            </tr>
          </thead>

          <tbody>
            {filteredSubscriptions.map((sub) => (
              <tr key={sub.id}>
                <td className="border p-1">{sub.user_id}</td>
                <td className="border p-1">{sub.start_date}</td>
                <td className="border p-1">{sub.end_date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

import { useState } from "react";

type FormType = {
  user_id: string;
  start_date: string;
  end_date: string;
};

export default function CreateSubscription({ onSuccess }: { onSuccess: () => void }) {
  const [form, setForm] = useState<FormType>({
    user_id: "",
    start_date: "",
    end_date: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (field: keyof FormType, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value || "", // ✅ never undefined
    }));
  };

  const handleSubmit = async () => {
    // ✅ Validation
    if (!form.user_id || !form.start_date || !form.end_date) {
      setMessage("All fields are required");
      return;
    }

    if (form.start_date > form.end_date) {
      setMessage("Start date must be before end date");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("http://localhost:5000/subscriptions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: Number(form.user_id),
          start_date: form.start_date,
          end_date: form.end_date,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Failed to create subscription");
        return;
      }

      setMessage("Subscription created successfully!");
      onSuccess();
      setForm({
        user_id: "",
        start_date: "",
        end_date: "",
      });
    } catch (error) {
      setMessage(JSON.stringify(error))
      alert(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5 max-w-100 md:min-h-screen m-auto flex flex-col gap-2 justify-center border-r-2">
      <h2 className="text-white text-2xl">Create Subscription</h2>

      <input
        placeholder="User ID"
        value={form.user_id}
        onChange={(e) => handleChange("user_id", e.target.value)}
        className="text-white border rounded px-2 p-1"
      />

      <input
        type="date"
        value={form.start_date}
        onChange={(e) => handleChange("start_date", e.target.value)}
        className="text-white border rounded px-2 p-1"
      />

      <input
        type="date"
        value={form.end_date}
        onChange={(e) => handleChange("end_date", e.target.value)}
        className="text-white border rounded px-2 p-1"
      />

      <button
        onClick={handleSubmit}
        disabled={loading}
        style={{
          cursor: loading ? "not-allowed" : "pointer",
        }}
        className="bg-white text-black w-full p-2"
      >
        {loading ? "Creating..." : "Subscribe"}
      </button>

      {message && <p className="text-red-400">{message}</p>}
    </div>
  );
}